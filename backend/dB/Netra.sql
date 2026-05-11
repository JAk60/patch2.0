USE [Netra]
GO
/****** Object:  Table [dbo].[alpha_beta]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[alpha_beta](
	[id] [varchar](8000) NOT NULL,
	[alpha] [float] NULL,
	[beta] [float] NULL,
	[component_id] [varchar](8000) NULL,
 CONSTRAINT [alpha_beta_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_manager_actual_data]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_manager_actual_data](
	[id] [varchar](200) NOT NULL,
	[interval_start_date] [date] NULL,
	[component_id] [varchar](8000) NULL,
	[f_s] [varchar](100) NULL,
	[interval_end_date] [date] NULL,
 CONSTRAINT [data_manager_actual_data_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_manager_expert]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_manager_expert](
	[id] [varchar](200) NOT NULL,
	[most_likely_life] [float] NULL,
	[max_life] [float] NULL,
	[min_life] [float] NULL,
	[component_id] [varchar](8000) NULL,
	[num_component_wo_failure] [float] NULL,
	[time_wo_failure] [float] NULL,
 CONSTRAINT [data_manager_expert_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_manager_interval_data]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_manager_interval_data](
	[id] [varchar](200) NULL,
	[installation_start_date] [date] NULL,
	[installation_end_date] [date] NULL,
	[component_id] [varchar](8000) NULL,
	[f_s] [varchar](200) NULL,
	[removal_start_date] [date] NULL,
	[removal_end_date] [date] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_manager_maintenance_data]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_manager_maintenance_data](
	[id] [varchar](200) NOT NULL,
	[component_id] [varchar](8000) NULL,
	[event_type] [varchar](200) NULL,
	[maint_date] [date] NULL,
	[maintenance_type] [varchar](200) NULL,
	[replaced_component_type] [varchar](200) NULL,
	[cannabalised_age] [varchar](100) NULL,
	[maintenance_duration] [float] NULL,
	[failure_mode] [varchar](8000) NULL,
	[description] [varchar](max) NULL,
 CONSTRAINT [data_manager_maintenance_data_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_manager_nprd]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_manager_nprd](
	[id] [varchar](200) NOT NULL,
	[failure_rate] [float] NULL,
	[beta] [float] NULL,
	[component_id] [varchar](8000) NULL,
 CONSTRAINT [data_manager_nprd_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_manager_oem]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_manager_oem](
	[id] [varchar](200) NOT NULL,
	[life_estimate1_name] [varchar](200) NULL,
	[life_estimate1_val] [float] NULL,
	[life_estimate2_name] [varchar](200) NULL,
	[life_estimate2_val] [float] NULL,
	[component_id] [varchar](8000) NULL,
 CONSTRAINT [data_manager_oem_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_manager_oem_expert]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_manager_oem_expert](
	[id] [varchar](200) NOT NULL,
	[most_likely_life] [float] NULL,
	[max_life] [float] NULL,
	[min_life] [float] NULL,
	[life_estimate_name] [varchar](200) NULL,
	[life_estimate_val] [float] NULL,
	[component_id] [varchar](8000) NULL,
	[num_component_wo_failure] [float] NULL,
	[time_wo_failure] [float] NULL,
 CONSTRAINT [data_manager_oem_expert_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_manager_overhaul_maint_data]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_manager_overhaul_maint_data](
	[id] [varchar](8000) NOT NULL,
	[component_id] [varchar](8000) NULL,
	[overhaul_id] [varchar](8000) NULL,
	[date] [date] NULL,
	[maintenance_type] [varchar](200) NULL,
	[running_age] [varchar](200) NULL,
	[associated_sub_system] [varchar](8000) NULL,
	[cmms_running_age] [varchar](200) NULL,
 CONSTRAINT [data_manager_overhaul_maint_data_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_manager_overhauls_info]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_manager_overhauls_info](
	[id] [varchar](8000) NOT NULL,
	[component_id] [varchar](8000) NULL,
	[overhaul_num] [varchar](200) NULL,
	[running_age] [varchar](200) NULL,
	[num_maintenance_event] [varchar](8000) NULL,
 CONSTRAINT [data_manager_overhauls_info_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_manager_prob_failure]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_manager_prob_failure](
	[id] [varchar](200) NOT NULL,
	[p_time] [float] NULL,
	[failure_p] [float] NULL,
	[component_id] [varchar](8000) NULL,
 CONSTRAINT [data_manager_prob_failure_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_manager_repairable_import]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_manager_repairable_import](
	[id] [varchar](200) NOT NULL,
	[alpha] [float] NULL,
	[beta] [float] NULL,
	[component_id] [varchar](8000) NULL,
 CONSTRAINT [data_manager_repairable_import_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[data_manager_replacable_import]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[data_manager_replacable_import](
	[id] [varchar](200) NOT NULL,
	[eta] [float] NULL,
	[beta] [float] NULL,
	[component_id] [varchar](8000) NULL,
 CONSTRAINT [data_manager_replacable_import_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[duty_cycle]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[duty_cycle](
	[duty_cycle_id] [varchar](8000) NOT NULL,
	[component_id] [varchar](8000) NOT NULL,
	[duty_cycle_value] [float] NULL,
 CONSTRAINT [duty_cycle_pk] PRIMARY KEY NONCLUSTERED 
(
	[duty_cycle_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[eta_beta]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[eta_beta](
	[id] [varchar](45) NOT NULL,
	[eta] [float] NULL,
	[beta] [float] NULL,
	[component_id] [varchar](8000) NULL,
	[priority] [int] NULL,
 CONSTRAINT [eta_beta_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[failure_modes]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[failure_modes](
	[failure_mode_id] [varchar](8000) NOT NULL,
	[component_id] [varchar](8000) NOT NULL,
	[failure_mode] [varchar](max) NULL,
 CONSTRAINT [failure_modes_pk] PRIMARY KEY NONCLUSTERED 
(
	[failure_mode_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[last_run_MLE_track]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[last_run_MLE_track](
	[date] [date] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[maintenance_configuration_data]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[maintenance_configuration_data](
	[maintenance_id] [varchar](8000) NOT NULL,
	[component_id] [varchar](8000) NOT NULL,
	[repair_type] [varchar](8000) NULL,
	[pm_applicable] [varchar](20) NULL,
	[pm_interval] [float] NULL,
	[can_be_replaced_by_ship_staff] [varchar](20) NULL,
	[is_system_param_recorded] [varchar](20) NULL,
 CONSTRAINT [maintenance_configuration_data_pk] PRIMARY KEY NONCLUSTERED 
(
	[maintenance_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[mission_profile]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[mission_profile](
	[id] [varchar](45) NOT NULL,
	[mission_name] [varchar](max) NULL,
	[harbour_dur] [varchar](200) NULL,
	[ELH_dur] [varchar](200) NULL,
	[cruise_dur] [varchar](200) NULL,
	[defense_dur] [varchar](200) NULL,
	[action_dur] [varchar](200) NULL,
	[target_rel] [float] NULL,
 CONSTRAINT [mission_profile_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[operational_data]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[operational_data](
	[id] [varchar](200) NOT NULL,
	[component_id] [varchar](8000) NULL,
	[operation_date] [date] NULL,
	[average_running] [int] NULL,
 CONSTRAINT [operational_data_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[parallel_configuration]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[parallel_configuration](
	[redundancy_id] [varchar](8000) NOT NULL,
	[component_id] [varchar](8000) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[parameter_data]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[parameter_data](
	[id] [varchar](8000) NOT NULL,
	[component_id] [varchar](8000) NOT NULL,
	[parameter_id] [varchar](8000) NOT NULL,
	[name] [varchar](8000) NOT NULL,
	[value] [varchar](200) NULL,
	[date] [varchar](200) NULL,
	[operating_hours] [int] NULL,
PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[phase_definition]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[phase_definition](
	[phase_id] [varchar](8000) NOT NULL,
	[component_id] [varchar](8000) NOT NULL,
	[phase_name] [varchar](8000) NULL,
	[type] [varchar](200) NULL,
	[unit] [varchar](200) NULL,
	[lower_bound] [varchar](200) NULL,
	[upper_bound] [varchar](200) NULL,
	[phase_range] [varchar](200) NULL,
	[description] [varchar](max) NULL,
 CONSTRAINT [phase_definition_pk] PRIMARY KEY NONCLUSTERED 
(
	[phase_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[phase_duty_cycle]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[phase_duty_cycle](
	[id] [varchar](8000) NOT NULL,
	[phase_id] [varchar](8000) NULL,
	[component_id] [varchar](8000) NULL,
	[duty_cycle] [float] NULL,
 CONSTRAINT [phase_duty_cycle_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[phase_life_multiplier]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[phase_life_multiplier](
	[id] [varchar](8000) NOT NULL,
	[phase_id] [varchar](8000) NULL,
	[component_id] [varchar](8000) NULL,
	[life_multiplier] [float] NULL,
 CONSTRAINT [phase_life_multiplier_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[rcm_asm]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[rcm_asm](
	[id] [varchar](80) NOT NULL,
	[equipment] [varchar](8000) NULL,
	[platform] [varchar](8000) NULL,
	[component] [varchar](8000) NULL,
	[equipment_id] [varchar](8000) NULL,
	[component_id] [varchar](8000) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[rcm_component]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[rcm_component](
	[component_id] [varchar](8000) NULL,
	[component_name] [varchar](8000) NULL,
	[rcm] [varchar](max) NULL,
	[parrent_id] [varchar](max) NULL,
	[parent_name] [varchar](8000) NULL,
	[system] [varchar](8000) NULL,
	[ship_name] [varchar](8000) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[redundancy_data]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[redundancy_data](
	[redundancy_id] [varchar](8000) NOT NULL,
	[component_id] [varchar](8000) NOT NULL,
	[k] [varchar](1) NULL,
	[n] [int] NULL,
	[redundancy_type] [varchar](8000) NULL,
	[system_name] [varchar](max) NULL,
	[system_parent_name] [varchar](max) NULL,
 CONSTRAINT [redundancy_data_pk] PRIMARY KEY NONCLUSTERED 
(
	[redundancy_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sensor_alarm_attributes]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sensor_alarm_attributes](
	[id] [varchar](8000) NOT NULL,
	[alarm_id] [varchar](8000) NOT NULL,
	[parameter_id] [varchar](8000) NOT NULL,
	[level_id] [varchar](8000) NOT NULL,
PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sensor_alarm_data]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sensor_alarm_data](
	[id] [varchar](8000) NOT NULL,
	[alarm] [varchar](200) NOT NULL,
PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sensor_based_data]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sensor_based_data](
	[id] [varchar](8000) NOT NULL,
	[component_id] [varchar](8000) NOT NULL,
	[equipment_id] [varchar](8000) NOT NULL,
	[failure_mode_id] [varchar](8000) NULL,
	[name] [varchar](8000) NOT NULL,
	[min_value] [varchar](200) NULL,
	[max_value] [varchar](200) NULL,
	[unit] [varchar](200) NULL,
	[level] [varchar](200) NULL,
	[frequency] [varchar](200) NULL,
	[data] [varchar](200) NULL,
	[P] [float] NULL,
	[F] [float] NULL,
PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sensor_parameter_attributes]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sensor_parameter_attributes](
	[id] [varchar](8000) NOT NULL,
	[parameter_id] [varchar](8000) NOT NULL,
	[level] [varchar](200) NULL,
	[threshold] [varchar](200) NULL,
PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[system_config_additional_info]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[system_config_additional_info](
	[id] [varchar](200) NOT NULL,
	[component_id] [varchar](8000) NULL,
	[component_name] [varchar](8000) NULL,
	[num_cycle_or_runtime] [float] NULL,
	[installation_date] [date] NULL,
	[unit] [varchar](8000) NULL,
	[harbour_k] [varchar](10) NULL,
	[elh_k] [varchar](10) NULL,
	[cruise_k] [varchar](10) NULL,
	[defense_k] [varchar](10) NULL,
	[action_k] [varchar](10) NULL,
	[maint_data_availability] [varchar](100) NULL,
 CONSTRAINT [system_config_additional_info_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[system_config_additional_info_parallel]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[system_config_additional_info_parallel](
	[id] [varchar](8000) NULL,
	[component_id] [varchar](8000) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[system_configuration]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[system_configuration](
	[component_id] [varchar](8000) NOT NULL,
	[component_name] [varchar](max) NOT NULL,
	[parent_id] [varchar](8000) NULL,
	[CMMS_EquipmentCode] [varchar](200) NULL,
	[is_lmu] [int] NULL,
	[parent_name] [varchar](8000) NULL,
	[ship_name] [varchar](max) NULL,
	[ship_category] [varchar](max) NULL,
	[ship_class] [varchar](max) NULL,
	[command] [varchar](max) NULL,
	[department] [varchar](max) NULL,
	[nomenclature] [varchar](8000) NULL,
	[etl] [bit] NULL,
 CONSTRAINT [system_configuration_pk] PRIMARY KEY NONCLUSTERED 
(
	[component_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[system_duty_cycle]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[system_duty_cycle](
	[duty_cycle_id] [varchar](8000) NOT NULL,
	[component_id] [varchar](8000) NULL,
	[phase_id] [varchar](8000) NULL,
	[phase_Definition_id] [varchar](8000) NULL,
	[duty_cycle_value] [float] NULL,
 CONSTRAINT [system_duty_cycle_pk] PRIMARY KEY NONCLUSTERED 
(
	[duty_cycle_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TTF_data]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TTF_data](
	[id] [varchar](200) NOT NULL,
	[hours] [float] NULL,
	[component_id] [varchar](8000) NULL,
	[f_s] [varchar](200) NULL,
	[priority] [int] NULL,
 CONSTRAINT [TTF_data_pk] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_selection]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_selection](
	[ship_name] [varchar](max) NULL,
	[ship_category] [varchar](max) NULL,
	[ship_class] [varchar](max) NULL,
	[command] [varchar](max) NULL,
	[department] [varchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 09-01-2024 11:48:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[user_id] [varchar](500) NOT NULL,
	[username] [varchar](500) NULL,
	[password] [varchar](500) NULL,
	[level] [nvarchar](2) NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[phase_definition] ADD  DEFAULT ('quantative') FOR [type]
GO
ALTER TABLE [dbo].[system_configuration] ADD  DEFAULT ((1)) FOR [is_lmu]
GO
ALTER TABLE [dbo].[system_duty_cycle] ADD  DEFAULT ((1)) FOR [duty_cycle_value]
GO
ALTER TABLE [dbo].[alpha_beta]  WITH CHECK ADD  CONSTRAINT [alpha_beta_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[alpha_beta] CHECK CONSTRAINT [alpha_beta_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[data_manager_actual_data]  WITH CHECK ADD  CONSTRAINT [data_manager_actual_data_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[data_manager_actual_data] CHECK CONSTRAINT [data_manager_actual_data_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[data_manager_expert]  WITH CHECK ADD  CONSTRAINT [data_manager_expert_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[data_manager_expert] CHECK CONSTRAINT [data_manager_expert_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[data_manager_interval_data]  WITH CHECK ADD  CONSTRAINT [data_manager_interval_data_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[data_manager_interval_data] CHECK CONSTRAINT [data_manager_interval_data_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[data_manager_maintenance_data]  WITH CHECK ADD  CONSTRAINT [data_manager_maintenance_data_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[data_manager_maintenance_data] CHECK CONSTRAINT [data_manager_maintenance_data_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[data_manager_nprd]  WITH CHECK ADD  CONSTRAINT [data_manager_nprd_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[data_manager_nprd] CHECK CONSTRAINT [data_manager_nprd_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[data_manager_oem]  WITH CHECK ADD  CONSTRAINT [data_manager_oem_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[data_manager_oem] CHECK CONSTRAINT [data_manager_oem_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[data_manager_oem_expert]  WITH CHECK ADD  CONSTRAINT [data_manager_oem_expert_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[data_manager_oem_expert] CHECK CONSTRAINT [data_manager_oem_expert_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[data_manager_overhaul_maint_data]  WITH CHECK ADD  CONSTRAINT [data_manager_overhaul_maint_data_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[data_manager_overhaul_maint_data] CHECK CONSTRAINT [data_manager_overhaul_maint_data_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[data_manager_overhauls_info]  WITH CHECK ADD  CONSTRAINT [data_manager_overhauls_info_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[data_manager_overhauls_info] CHECK CONSTRAINT [data_manager_overhauls_info_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[data_manager_prob_failure]  WITH CHECK ADD  CONSTRAINT [data_manager_prob_failure_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[data_manager_prob_failure] CHECK CONSTRAINT [data_manager_prob_failure_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[data_manager_repairable_import]  WITH CHECK ADD  CONSTRAINT [data_manager_repairable_import_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[data_manager_repairable_import] CHECK CONSTRAINT [data_manager_repairable_import_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[data_manager_replacable_import]  WITH CHECK ADD  CONSTRAINT [data_manager_replacable_import_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[data_manager_replacable_import] CHECK CONSTRAINT [data_manager_replacable_import_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[duty_cycle]  WITH CHECK ADD  CONSTRAINT [duty_cycle_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[duty_cycle] CHECK CONSTRAINT [duty_cycle_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[eta_beta]  WITH CHECK ADD  CONSTRAINT [eta_beta_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[eta_beta] CHECK CONSTRAINT [eta_beta_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[failure_modes]  WITH CHECK ADD  CONSTRAINT [failure_modes_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[failure_modes] CHECK CONSTRAINT [failure_modes_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[maintenance_configuration_data]  WITH CHECK ADD  CONSTRAINT [maintenance_configuration_data_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[maintenance_configuration_data] CHECK CONSTRAINT [maintenance_configuration_data_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[operational_data]  WITH CHECK ADD  CONSTRAINT [operational_data_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[operational_data] CHECK CONSTRAINT [operational_data_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[parallel_configuration]  WITH CHECK ADD  CONSTRAINT [parallel_configuration_redundancy_data_redundancy_id_fk] FOREIGN KEY([redundancy_id])
REFERENCES [dbo].[redundancy_data] ([redundancy_id])
GO
ALTER TABLE [dbo].[parallel_configuration] CHECK CONSTRAINT [parallel_configuration_redundancy_data_redundancy_id_fk]
GO
ALTER TABLE [dbo].[parallel_configuration]  WITH CHECK ADD  CONSTRAINT [parallel_configuration_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[parallel_configuration] CHECK CONSTRAINT [parallel_configuration_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[parameter_data]  WITH CHECK ADD  CONSTRAINT [parameter_data_sensor_based_data_id_fk] FOREIGN KEY([parameter_id])
REFERENCES [dbo].[sensor_based_data] ([id])
GO
ALTER TABLE [dbo].[parameter_data] CHECK CONSTRAINT [parameter_data_sensor_based_data_id_fk]
GO
ALTER TABLE [dbo].[parameter_data]  WITH CHECK ADD  CONSTRAINT [parameter_data_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[parameter_data] CHECK CONSTRAINT [parameter_data_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[phase_duty_cycle]  WITH CHECK ADD  CONSTRAINT [phase_duty_cycle_phase_definition_phase_id_fk] FOREIGN KEY([phase_id])
REFERENCES [dbo].[phase_definition] ([phase_id])
GO
ALTER TABLE [dbo].[phase_duty_cycle] CHECK CONSTRAINT [phase_duty_cycle_phase_definition_phase_id_fk]
GO
ALTER TABLE [dbo].[phase_duty_cycle]  WITH CHECK ADD  CONSTRAINT [phase_duty_cycle_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[phase_duty_cycle] CHECK CONSTRAINT [phase_duty_cycle_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[phase_life_multiplier]  WITH CHECK ADD  CONSTRAINT [phase_life_multiplier_phase_definition_phase_id_fk] FOREIGN KEY([phase_id])
REFERENCES [dbo].[phase_definition] ([phase_id])
GO
ALTER TABLE [dbo].[phase_life_multiplier] CHECK CONSTRAINT [phase_life_multiplier_phase_definition_phase_id_fk]
GO
ALTER TABLE [dbo].[phase_life_multiplier]  WITH CHECK ADD  CONSTRAINT [phase_life_multiplier_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[phase_life_multiplier] CHECK CONSTRAINT [phase_life_multiplier_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[redundancy_data]  WITH CHECK ADD  CONSTRAINT [redundancy_data_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[redundancy_data] CHECK CONSTRAINT [redundancy_data_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[sensor_alarm_attributes]  WITH CHECK ADD  CONSTRAINT [sensor_alarm_attributes_sensor_alarm_data_id_fk] FOREIGN KEY([alarm_id])
REFERENCES [dbo].[sensor_alarm_data] ([id])
GO
ALTER TABLE [dbo].[sensor_alarm_attributes] CHECK CONSTRAINT [sensor_alarm_attributes_sensor_alarm_data_id_fk]
GO
ALTER TABLE [dbo].[sensor_alarm_attributes]  WITH CHECK ADD  CONSTRAINT [sensor_alarm_attributes_sensor_based_data_id_fk] FOREIGN KEY([parameter_id])
REFERENCES [dbo].[sensor_based_data] ([id])
GO
ALTER TABLE [dbo].[sensor_alarm_attributes] CHECK CONSTRAINT [sensor_alarm_attributes_sensor_based_data_id_fk]
GO
ALTER TABLE [dbo].[sensor_alarm_attributes]  WITH CHECK ADD  CONSTRAINT [sensor_alarm_attributes_sensor_parameter_attributes_id_fk] FOREIGN KEY([level_id])
REFERENCES [dbo].[sensor_parameter_attributes] ([id])
GO
ALTER TABLE [dbo].[sensor_alarm_attributes] CHECK CONSTRAINT [sensor_alarm_attributes_sensor_parameter_attributes_id_fk]
GO
ALTER TABLE [dbo].[sensor_based_data]  WITH CHECK ADD  CONSTRAINT [sensor_based_data_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[sensor_based_data] CHECK CONSTRAINT [sensor_based_data_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[sensor_parameter_attributes]  WITH CHECK ADD  CONSTRAINT [sensor_parameter_attributes_sensor_based_data_id_fk] FOREIGN KEY([parameter_id])
REFERENCES [dbo].[sensor_based_data] ([id])
GO
ALTER TABLE [dbo].[sensor_parameter_attributes] CHECK CONSTRAINT [sensor_parameter_attributes_sensor_based_data_id_fk]
GO
ALTER TABLE [dbo].[system_config_additional_info]  WITH CHECK ADD  CONSTRAINT [system_config_additional_info_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[system_config_additional_info] CHECK CONSTRAINT [system_config_additional_info_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[system_config_additional_info_parallel]  WITH CHECK ADD  CONSTRAINT [system_config_additional_info_parallel_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[system_config_additional_info_parallel] CHECK CONSTRAINT [system_config_additional_info_parallel_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[system_duty_cycle]  WITH CHECK ADD  CONSTRAINT [system_duty_cycle_phase_definition_phase_id_fk] FOREIGN KEY([phase_id])
REFERENCES [dbo].[phase_definition] ([phase_id])
GO
ALTER TABLE [dbo].[system_duty_cycle] CHECK CONSTRAINT [system_duty_cycle_phase_definition_phase_id_fk]
GO
ALTER TABLE [dbo].[system_duty_cycle]  WITH CHECK ADD  CONSTRAINT [system_duty_cycle_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[system_duty_cycle] CHECK CONSTRAINT [system_duty_cycle_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[TTF_data]  WITH CHECK ADD  CONSTRAINT [TTF_data_system_configuration_component_id_fk] FOREIGN KEY([component_id])
REFERENCES [dbo].[system_configuration] ([component_id])
GO
ALTER TABLE [dbo].[TTF_data] CHECK CONSTRAINT [TTF_data_system_configuration_component_id_fk]
GO
ALTER TABLE [dbo].[users]  WITH CHECK ADD CHECK  (([level]='S' OR [level]='L6' OR [level]='L5' OR [level]='L4' OR [level]='L3' OR [level]='L2' OR [level]='L1'))
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'This Table maints the record of all parallel information' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'parallel_configuration'
GO
