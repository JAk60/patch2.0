import pandas as pd  # for data manipulation
import networkx as nx  # for drawing graphs
import matplotlib.pyplot as plt  # for drawing graphs

# for creating Bayesian Belief Networks (BBN)
from pybbn.graph.dag import Bbn
from pybbn.graph.edge import Edge, EdgeType
from pybbn.graph.jointree import EvidenceBuilder
from pybbn.graph.node import BbnNode
from pybbn.graph.variable import Variable
from pybbn.pptc.inferencecontroller import InferenceController


class BayesianNetwork:
    def estimate(self, probs):
        op1 = BbnNode(Variable(0, 'op1', ['L', 'N', 'M', 'H']), probs)
        sub1 = BbnNode(Variable(1, 'Sub1', ['Healthy', 'PD', 'FD', 'F']),
                       [0.9, 0.1, 0, 0,
                        0.5, 0.4, 0.1, 0,
                        0.1, 0.8, 0.1, 0,
                        0, 0, 0.8, 0.2])

        # Create Network
        bbn1 = Bbn().add_node(op1) \
            .add_node(sub1) \
            .add_edge(Edge(op1, sub1, EdgeType.DIRECTED))

        tree = InferenceController.apply(bbn1)
        self.print_probs(tree)

    def print_probs(self, tree):
        for node in tree.get_bbn_nodes():
            if node.variable.name == "Sub1":
                potential = tree.get_bbn_potential(node)
                print("Node:", node.variable.name)
                print("Values:")
                print(potential)
                print('----------------')
