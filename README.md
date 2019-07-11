### GROUP MEMBERS
* Miggy Pinaroc
* Cobbie Quintos

# Installation
To install the project locally, a working version of npm must be installed on the machine. npm can be installed with different operating systems [here](https://www.npmjs.com/get-npm).

To install this project and all its dependencies via the terminal/command line:
```
npm install
```
To start running the project on port 3000: 
```
npm start
```
If yarn is installed and preferred: 
```
yarn install
yarn start
```

This project implements the uninformed search algorithms Depth-First Search (DFS) and Breadth-First Search (BFS) in an environment that simulates a pokedex structured in a hierarchical manner. The main technologies used for this project are ReactJS and D3.js.

# Usage
The user may pick between two operations and two algorithms: Tree Generation and Tree Traversal using either DFS or BFS. 

For Tree Generation, the user may choose a Pokemon generation (1 or 1,2,3) and the appropriate tree will be created using the selected algorithm. 

For Tree Traversal, the user may type in the name of a pokemon, and upon selecting/clicking the algorithm choice, the tree of the pokedex will be traversed by the agent. The visualization of the traversal displays visited nodes in red, and the agent will stop at a matched node, highlighting it in blue. If no such pokemon exists, the whole tree will be visited (red).

As the focus of this project was to visualize the algorithms in action, the front-end has not yet been optimized: responsive design has not yet been implemented, so this project would be best viewed in a full-screen browser.
# Online Version
This project is currently deployed online using Netlify. 



# Credit

The D3 code used to create the radial tree was written by **Herman Sontrop**. The source code for this could be found [here](https://bl.ocks.org/FrissAnalytics/ffbd3cb71848616957cd4c0f41738aec?fbclid=IwAR2D-Wbmua4TPwmDAtspmYW1z5z5j81tDJBJOPThczmbqJnouLWUjmmfVg8).

We also built upon **Herman Sontrop**'s [idea](https://bl.ocks.org/mph006/7e7d7f629de75ada9af5?fbclid=IwAR1H87O5JykosRT_a3EyajJc41g2kKoVqZgkeJ6Z4wEi62sGiqMt2APNnBM) for using buttons to display the traversals.