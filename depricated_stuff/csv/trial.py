def train(projection_head, model, train_loader, test_loader, unlabelled_train_loader, args, aux_dataloader=None, aux_model=None, val_loader=None):

    model_params = list(projection_head.parameters()) + list(model.parameters())

    sup_con_crit = SupConLoss()
    best_test_acc_lab = 0
    i_iter = 0
    
    iter_aux_dataloader = iter(aux_dataloader)
    aux_projection_head = aux_model[1]
    aux_model = aux_model[0]
    aux_model.eval()
    aux_projection_head.train()
    model_params += list(aux_projection_head.parameters())

    
    optimizer = SGD(model_params, lr=args.lr, momentum=args.momentum,
                    weight_decay=args.weight_decay)
    
    exp_lr_scheduler = lr_scheduler.CosineAnnealingLR(
            optimizer,
            T_max=args.epochs,
            eta_min=args.lr * 1e-3,
        )
            
    for epoch in range(args.epochs):

        loss_record = AverageMeter()
        train_acc_record = AverageMeter()
        mymeter = MyMeter()

        projection_head.train()
        model.train()
                    
        ### training
        with tqdm(total=len(train_loader)) as pbar:
            for batch_idx, batch in enumerate(train_loader):

                images, class_labels, uq_idxs, mask_lab = batch
                mask_lab = mask_lab[:, 0] ### B
                class_labels, mask_lab = class_labels.to(device), mask_lab.to(device).bool()
                images = torch.cat(images, dim=0).to(device) ### [nview*B, 3, H, W]
                    
                features = forward(images, model, projection_head, 
                                   predict_token=args.predict_token, 
                                   num_prompts=args.num_dpr,
                                   num_cop=args.num_dpr,
                                   aux_projection_head=aux_projection_head,
                                   )
                
                loss = 0.0
                
                ### unpack features
                aux_loss = 0
                aux_features = features[1]
                features = features[0]
                
                ### DPR loss
                contrastive_logits, contrastive_labels = info_nce_logits(features=aux_features, args=args)
                unsup_contrastive_loss = torch.nn.CrossEntropyLoss()(contrastive_logits, contrastive_labels)

                # Supervised contrastive loss
                f1, f2 = [f[mask_lab] for f in aux_features.chunk(2)] ### nview[B', C, H, W]
                sup_con_feats = torch.cat([f1.unsqueeze(1), f2.unsqueeze(1)], dim=1) ### [B, nview, C, H, W]
                sup_con_labels = class_labels[mask_lab]
                sup_con_loss = sup_con_crit(sup_con_feats, labels=sup_con_labels)
                
                # Total loss
                aux_loss += (1 - args.sup_con_weight) * unsup_contrastive_loss + args.sup_con_weight * sup_con_loss
                loss += args.w_prompt_clu * aux_loss
                mymeter.add('aux_loss', aux_loss.item())
                    
                    
                # Choose which instances to run the contrastive loss on
                if args.contrast_unlabel_only:
                    # Contrastive loss only on unlabelled instances
                    f1, f2 = [f[~mask_lab] for f in features.chunk(2)]
                    con_feats = torch.cat([f1, f2], dim=0)
                else:
                    # Contrastive loss for all examples
                    con_feats = features

                contrastive_logits, contrastive_labels = info_nce_logits(features=con_feats, args=args)
                unsup_contrastive_loss = torch.nn.CrossEntropyLoss()(contrastive_logits, contrastive_labels)

                # Supervised contrastive loss
                f1, f2 = [f[mask_lab] for f in features.chunk(2)] ### nview[B', C, H, W]
                sup_con_feats = torch.cat([f1.unsqueeze(1), f2.unsqueeze(1)], dim=1) ### [B, nview, C, H, W]
                sup_con_labels = class_labels[mask_lab]
                sup_con_loss = sup_con_crit(sup_con_feats, labels=sup_con_labels)
                
                # Total loss
                loss += (1 - args.sup_con_weight) * unsup_contrastive_loss + args.sup_con_weight * sup_con_loss
                
                # INKD
                if epoch<args.inkd_T:
                    try:
                        aux_images, _ = next(iter_aux_dataloader)
                        aux_images = aux_images.to(args.device)
                    except StopIteration as e:
                        iter_aux_dataloader = iter(aux_dataloader)
                        aux_images, _ = next(iter_aux_dataloader)
                        aux_images = aux_images.to(args.device)
                    inkd_loss = forward_single_inkd(model, aux_model, aux_images, loss_func=F.mse_loss, distill='features')
                    loss += max(0, annealing_decay(args.w_inkd_loss, args.w_inkd_loss_min, epoch, args.inkd_T)) * inkd_loss
                    mymeter.add('inkd_loss', inkd_loss.item())
                else:
                    mymeter.add('inkd_loss', 0)


                # Record
                _, pred = contrastive_logits.max(1)
                acc = (pred == contrastive_labels).float().mean().item()
                train_acc_record.update(acc, pred.size(0))
                loss_record.update(loss.item(), class_labels.size(0))
                
                mymeter.add('unsup_contrastive_loss', unsup_contrastive_loss.item())
                mymeter.add('sup_con_loss', sup_con_loss.item())
                
                # Backward
                optimizer.zero_grad()
                loss.backward()
                
                
                # optimize
                optimizer.step()
                
                
                pbar.update(1)
                pbar.set_postfix(
                    loss=loss_record.avg,
                    train_acc_record=train_acc_record.avg,
                    inkd_loss=mymeter.mean('inkd_loss'),
                    unsup_contrastive_loss=mymeter.mean('unsup_contrastive_loss'),
                    sup_con_loss=mymeter.mean('sup_con_loss'),
                    aux_loss=mymeter.mean('aux_loss'),
                    epoch=epoch,
                )
                
                i_iter += 1

       # Step schedule
        exp_lr_scheduler.step()
        
        torch.save(model.state_dict(), args.model_path)
        print("model saved to {}.".format(args.model_path))
        torch.save(projection_head.state_dict(), args.model_path[:-3] + '_proj_head.pt')
        print("projection head saved to {}.".format(args.model_path[:-3] + '_proj_head.pt'))

        # ----------------
        # LOG
        # ----------------
        args.writer.add_scalar('Loss/unsup_contrastive_loss', mymeter.mean('unsup_contrastive_loss'), epoch)
        args.writer.add_scalar('Loss/sup_con_loss', mymeter.mean('sup_con_loss'), epoch)
        args.writer.add_scalar('Loss/inkd_loss', mymeter.mean('inkd_loss'), epoch)
        args.writer.add_scalar('Loss/total', loss_record.avg, epoch)
        args.writer.add_scalar('Train Acc Labelled Data', train_acc_record.avg, epoch)
        args.writer.add_scalar('LR', get_mean_lr(optimizer), epoch)
        
        print('Train Epoch: {} Avg Loss: {:.4f} | Seen Class Acc: {:.4f} '.format(epoch, loss_record.avg,
                                                                                  train_acc_record.avg))
        
        # ----------------
        # clustering
        # ----------------
        if epoch%args.eval_interval==(args.eval_interval-1):
            if epoch%args.kmeans_interval==(args.kmeans_interval-1):
                with torch.no_grad():
                    print('Testing on unlabelled examples in the training data...')
                    all_acc, old_acc, new_acc = test_kmeans(model, unlabelled_train_loader,
                                                            epoch=epoch, save_name='Train ACC Unlabelled',
                                                            args=args, predict_token='cls')
                    print('Testing on disjoint test set...')
                    all_acc_test, old_acc_test, new_acc_test = test_kmeans(model, test_loader,
                                                                        epoch=epoch, save_name='Test ACC',
                                                                        args=args, predict_token='cls')
                    print('Train Accuracies: All {:.4f} | Old {:.4f} | New {:.4f}'.format(all_acc, old_acc,
                                                                                        new_acc))
                    print('Test Accuracies: All {:.4f} | Old {:.4f} | New {:.4f}'.format(all_acc_test, old_acc_test,
                                                                                            new_acc_test))

                    if args.use_val==True:
                        print('Testing on val set...')
                        lbl_score, unlbl_score, total_sil = test_kmeans_val(model, val_loader,
                                                                            epoch=epoch, save_name='Val ACC',
                                                                            args=args, use_fast_Kmeans=False, 
                                                                            predict_token='cls', 
                                                                            return_silhouette=True,
                                                                            stage=2,
                                                                            )
                        old_acc_test = lbl_score
                    
                args.writer.add_scalar('Surveillance/val_score', old_acc_test, epoch)
                if (old_acc_test > best_test_acc_lab):
                    print(f'Best ACC on old Classes on disjoint test set: {old_acc_test:.4f}...')
                    print('Best Train Accuracies: All {:.4f} | Old {:.4f} | New {:.4f}'.format(all_acc, old_acc,
                                                                                        new_acc))
                    torch.save(model.state_dict(), args.model_path[:-3] + f'_best.pt')
                    print("model saved to {}.".format(args.model_path[:-3] + f'_best.pt'))
                    torch.save(projection_head.state_dict(), args.model_path[:-3] + f'_proj_head_best.pt')
                    print("projection head saved to {}.".format(args.model_path[:-3] + f'_aux_proj_head_best.pt'))
                    torch.save(aux_projection_head.state_dict(), args.model_path[:-3] + f'_aux_proj_head_best.pt')
                    best_test_acc_lab = old_acc_test
            else:
                with torch.no_grad():
                    print('Testing on unlabelled examples in the training data...')
                    all_acc, old_acc, new_acc = test_kmeans(model, unlabelled_train_loader,
                                                            epoch=epoch, save_name='Fast Train ACC Unlabelled',
                                                            args=args, 
                                                            use_fast_Kmeans=True, 
                                                            predict_token='cls')

                    print('Testing on disjoint test set...')
                    all_acc_test, old_acc_test, new_acc_test = test_kmeans(model, test_loader,
                                                                        epoch=epoch, save_name='Fast Test ACC',
                                                                        args=args,
                                                                        use_fast_Kmeans=True, 
                                                                        predict_token='cls')
                    print('Train Accuracies: All {:.4f} | Old {:.4f} | New {:.4f}'.format(all_acc, old_acc,
                                                                                        new_acc))
                    print('Test Accuracies: All {:.4f} | Old {:.4f} | New {:.4f}'.format(all_acc_test, old_acc_test,
                                                                                            new_acc_test))
                    
                    if args.use_val==True:
                        print('Testing on val set...')
                        lbl_score, unlbl_score, total_sil = test_kmeans_val(model, val_loader,
                                                                            epoch=epoch, save_name='Fast Val ACC',
                                                                            args=args, use_fast_Kmeans=True, 
                                                                            predict_token='cls', 
                                                                            return_silhouette=True,
                                                                            stage=2,
                                                                            )
                        old_acc_test = lbl_score
                        
                args.writer.add_scalar('Surveillance/val_score', old_acc_test, epoch)
                if args.use_fast_kmeans and (old_acc_test > best_test_acc_lab):
                    print(f'Best ACC on old Classes on disjoint test set: {old_acc_test:.4f}...')
                    print('Best Train Accuracies: All {:.4f} | Old {:.4f} | New {:.4f}'.format(all_acc, old_acc,
                                                                                        new_acc))
                    torch.save(model.state_dict(), args.model_path[:-3] + f'_best.pt')
                    print("model saved to {}.".format(args.model_path[:-3] + f'_best.pt'))
                    torch.save(projection_head.state_dict(), args.model_path[:-3] + f'_proj_head_best.pt')
                    print("projection head saved to {}.".format(args.model_path[:-3] + f'_proj_head_best.pt'))
                    print("projection head saved to {}.".format(args.model_path[:-3] + f'_aux_proj_head_best.pt'))
                    torch.save(aux_projection_head.state_dict(), args.model_path[:-3] + f'_aux_proj_head_best.pt')
                    best_test_acc_lab = old_acc_test
                
        if epoch%args.checkpoint_interval==(args.checkpoint_interval-1):
            epoch_checkpoint(model, projection_head, args)
        if epoch%(args.early_stop+1)==args.early_stop:
            break
        
    return