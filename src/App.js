import React from 'react';
import Header from './components/Header/Header';
import InfoSearch from './components/InfoSearch/InfoSearch';
import Button from './components/Button/Button';
import * as d3 from "d3";
import "./css/RadialTree.css";
import './stylesheets/app.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      treeOperation: true,
      searchInput: '',
      traversalPath: [],
      isTree: false,
      gen: '1'
     }
     this.gen1 = "./gen1_tree.json";
     this.gen123 = "./gen123.json";
  }

  drawGenerate = genType => {
    d3.select("svg").remove();
    const gen = this.state.gen === '1' ? this.gen1 : this.gen123;
    d3.json(gen).then(treeData => {
      var data = treeData[0];

      // TREE DIAGRAM
      var svg = d3.select("body").append("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg
          .append("g")
          .attr(
            "transform",
            "translate(" + (width / 2 + 640) + "," + (height / 2 + 690) + ")"
          );

      var stratify = d3.stratify().parentId(function(d) {
        return d.id.substring(0, d.id.lastIndexOf("."));
      });

      var tree = d3
        .tree()
        .size([360, 500])
        .separation(function(a, b) {
          return (a.parent === b.parent ? 1 : 2) / a.depth;
        });

      // build with json file
      var root = tree(d3.hierarchy(data));
      console.log(root);
      // var fringe = [root.data];
      // console.log(root.descendants().length);

      // bfs
      var i = 0;
      var bfs_loop = function(root) {
        var link = g
          .selectAll(".link")
          .data(root.descendants().slice(1, 1 + i)) // ends at 1,0 (-230)
          .enter()
          .append("path")
          .attr("class", "link")
          .attr("d", function(d) {
            return (
              "M" +
              project(d.x, d.y) +
              "C" +
              project(d.x, (d.y + d.parent.y) / 2) +
              " " +
              project(d.parent.x, (d.y + d.parent.y) / 2) +
              " " +
              project(d.parent.x, d.parent.y)
            );
          });

        var node = g
          .selectAll(".node")
          .data(root.descendants().slice(0, 1 + i)) // ends at 0,231 (+230)
          .enter()
          .append("g")
          .attr("class", function(d) {
            return "node" + (d.children ? " node--internal" : " node--leaf");
          })
          .attr("transform", function(d) {
            return "translate(" + project(d.x, d.y) + ")";
          });

        node.append("circle").attr("r", 2.5);

        node
          .append("text")
          .attr("dy", ".31em")
          .attr("x", function(d) {
            return d.x < 180 === !d.children ? 6 : -6;
          })
          .style("text-anchor", function(d) {
            return d.x < 180 === !d.children ? "start" : "end";
          })
          .attr("transform", function(d) {
            return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")";
          })
          .text(function(d) {
            return d.data.name;
          });
        i++;
        console.log(i);
      };

      var j = 0;
      var get_deep = root => {
        var fringe = [root];
        for (let i = 0; i < root.children.length; i++) {
          fringe.push(root.children[i]);
          for (let j = 0; j < root.children[i].children.length; j++) {
            fringe.push(root.children[i].children[j]);
            for (let k = 0;k < root.children[i].children[j].children.length;k++) {
              fringe.push(root.children[i].children[j].children[k]);
              for (let l = 0;l < root.children[i].children[j].children[k].children.length;l++) {
                fringe.push(root.children[i].children[j].children[k].children[l]);
                if(this.state.gen==="123"){

                  for(let m = 0;m <root.children[i].children[j].children[k].children[l].children.length;m++) {
                    fringe.push(
                      root.children[i].children[j].children[k]
											.children[l].children[m]
                      );
                    }
                  }
              }
            }
          }
        }
        return fringe;
      };
      // var d = get_deep(root)

      var dfs_loop = function(root) {
        var link = g
          .selectAll(".link")
          .data(root.slice(1, 1 + j))
          .enter()
          .append("path")
          .attr("class", "link")
          .attr("d", function(d) {
            return (
              "M" +
              project(d.x, d.y) +
              "C" +
              project(d.x, (d.y + d.parent.y) / 2) +
              " " +
              project(d.parent.x, (d.y + d.parent.y) / 2) +
              " " +
              project(d.parent.x, d.parent.y)
            );
          });

        var node = g
          .selectAll(".node")
          .data(root.slice(0, 1 + j))
          .enter()
          .append("g")
          .attr("class", function(d) {
            return "node" + (d.children ? " node--internal" : " node--leaf");
          })
          .attr("transform", function(d) {
            return "translate(" + project(d.x, d.y) + ")";
          });

        node.append("circle").attr("r", 2.5);
        // node.select("circle").style("fill","red")

        node
          .append("text")
          .attr("dy", ".31em")
          .attr("x", function(d) {
            return d.x < 180 === !d.children ? 6 : -6;
          })
          .style("text-anchor", function(d) {
            return d.x < 180 === !d.children ? "start" : "end";
          })
          .attr("transform", function(d) {
            return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")";
          })
          .text(function(d) {
            return d.data.name;
          });

        j++;
        console.log(j);
      };

      var timer;
      // BREADTH FIRST
      if (genType === "bfs") {
        timer = d3.interval(function(duration) {
          bfs_loop(root);
          if (i === root.descendants().length + 1) {
            timer.stop();
          }
        }, 100);
      }

      // DEPTH FIRST
      else if (genType === "dfs") {

        timer = d3.interval(function(duration) {
          var d_root = get_deep(root);
          dfs_loop(d_root);
          if (j === d_root.length + 1) {
            timer.stop();
          }
        }, 100);
      }

      function project(x, y) {
        var angle = ((x - 90) / 180) * Math.PI,
          radius = y;
        return [radius * Math.cos(angle), radius * Math.sin(angle)];
      }

      // https://gist.github.com/mph006/7e7d7f629de75ada9af5
      /*
                                    var visitElement = function(element, animX) {
                                        // d3.select("#node-"+element.id).classed("visited",true);
                                        d3.select(
                                            "node" + (element.children ? " node--internal" : " node--leaf")
                                            )
                                            .transition()
                                            .duration(500)
                                            .delay(500 * animX)
                                            .style("fill", "red")
                                            .style("stroke", "red");
                                        };
                                        
                                        var dft = () => {
                                            var stack = [];
                                            var animX = 0;
                                            stack.push(root);
                                            while (stack.length !== 0) {
                                                var element = stack.pop();
                                                visitElement(element, animX);
                                                animX = animX + 1;
                                                if (element.children !== undefined) {
                                                    for (var i = 0; i < element.children.length; i++) {
                                                        stack.push(element.children[element.children.length - i - 1]);
                                                    }
                                                }
                                            }
                                        };
                                        
                                        var bft = () => {
                                            var queue = [];
                                            var animX = 0;
                                            queue.push(root);
                                            while (queue.length !== 0) {
                                                var element = queue.shift();
                                                visitElement(element, animX);
                                                animX = animX + 1;
                                                if (element.children !== undefined) {
                                                    for (var i = 0; i < element.children.length; i++) {
                                                        queue.push(element.children[i]);
                                                    }
                                                }
                                            }
                                        };
                                        var resetTraversal = (root) => {
                                            //d3.selectAll(".node").classed("visited",false);
                                            d3.selectAll(".node")
                                            .transition()
                                            .duration(500)
                                            .style("fill", "#fff")
                                            .style("stroke", "steelblue");
                                        } */
    });
  };
  // genType: bfs/dfs
  drawTraversal = genType => {
    d3.select("svg").remove();
    const gen = this.state.gen === '1' ? this.gen1 : this.gen123;
    d3.json(gen).then(treeData => {
      var data = treeData[0];
      var i = 0;
      var goal = this.state.searchInput;
      var tree = d3
        .tree()
        .size([360, 500])
        .separation(function(a, b) {
          return (a.parent === b.parent ? 1 : 2) / a.depth;
        });
      d3.selection.prototype.moveToFront = function() {
        return this.each(function() {
          this.parentNode.appendChild(this);
        });
      };

      var svg = d3.select("body").append("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg
          .append("g")
          .attr(
            "transform",
            "translate(" + (width / 2 + 640) + "," + (height / 2 + 690) + ")"
          );

      var root = tree(d3.hierarchy(data));

      var resetTraversal = function(root) {
        d3.selectAll(".node")
          .selectAll("circle")
          .transition()
          .duration(500)
          // .style("fill", "#fff")
          // .style("stroke", "steelblue");
      };

      var update = function(root) {
        resetTraversal(root);

        var node = g
          .selectAll(".node")
          .data(root.descendants().slice(), function(d) {
            return d.id || (d.id = ++i);
          })
          .enter()
          .append("g")
          .attr("class", function(d) {
            return (
              "node" +
              (d.children
                ? " node--internal node-" + d.id
                : " node--leaf node-" + d.id)
            );
          })
          .attr("transform", function(d) {
            return "translate(" + project(d.x, d.y) + ")";
          });

        var link = g
          .selectAll(".link")
          .data(root.descendants().slice(1))
          .enter()
          .append("path")
          .attr("class", "link")
          .attr("d", function(d) {
            return (
              "M" +
              project(d.x, d.y) +
              "C" +
              project(d.x, (d.y + d.parent.y) / 2) +
              " " +
              project(d.parent.x, (d.y + d.parent.y) / 2) +
              " " +
              project(d.parent.x, d.parent.y)
            );
          });

        node.append("circle").attr("r", 2.5);

        node
          .append("text")
          .attr("dy", ".31em")
          .attr("x", function(d) {
            return d.x < 180 === !d.children ? 6 : -6;
          })
          .style("text-anchor", function(d) {
            return d.x < 180 === !d.children ? "start" : "end";
          })
          .attr("transform", function(d) {
            return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")";
          })
          .text(function(d) {
            return d.data.name;
          });
      };

      var visitElement = function(element, animate) {
        d3.select(".node-" + element.id)
        .select("circle")
          .transition()
          .duration(500)
          .delay(100 * animate)
          .style("fill", "red")
          // .style("stroke", "red");,
      // };
          .style("stroke","red");
            };
            
            var visitGoal = function(element, animate) {
                d3.select(".node-" + element.id)
                    .select("circle")
					.transition()
					.duration(500)
					.delay(100 * animate)
					.style("fill", "blue")
					.style("stroke","blue");
            };

      update(root);
      // goal = [...this.state.searchInput];
      console.log(`goal: ${goal}`)
      var dft = (root, goal) => {
        console.log("curNode", data);
        var stack = [];
        var animate = 0;
        stack.push(root);
        while (stack.length !== 0) {
          var element = stack.pop();
          this.setState({traversalPath: [...this.state.traversalPath, element.data.name]})
          console.log(element.data.name)
                    if(goal.toLowerCase() === element.data.name.toLowerCase()) {
                        visitGoal(element, animate);
                        break;
                    } 

          visitElement(element, animate);
          animate = animate + 1;
          if (element.children !== undefined) {
            for (var i = 0; i < element.children.length; i++) {
              stack.push(element.children[element.children.length - i - 1]);
              
            }
            
          }


        }
      };

      var bft = (root, goal) => {
        var queue = [];
        var animate = 0;
        queue.push(root);
        while (queue.length !== 0) {
          var element = queue.shift();
          this.setState({traversalPath: [...this.state.traversalPath, element.data.name]})
          if(goal.toLowerCase() === element.data.name.toLowerCase()) {
            visitGoal(element, animate);
            break;
        }

          visitElement(element, animate);
          animate = animate + 1;
          if (element.children !== undefined) {
            for (var i = 0; i < element.children.length; i++) {
              queue.push(element.children[i]);
            }
          }
        }
      };

      
      genType === 'bfs' ? bft(root,goal): dft(root, goal);

      function project(x, y) {
        var angle = ((x - 90) / 180) * Math.PI,
          radius = y;
        return [radius * Math.cos(angle), radius * Math.sin(angle)];
      }
    });

    // function resetTraversal(root){
    //     //d3.selectAll(".node").classed("visited",false);
    //     d3.selectAll(".node")
    //         .transition().duration(500)
    //         .style("fill","#fff")
    //         .style("stroke","steelblue");

    // }
  };

  renderInfoSearch = () => {
    let tempArr1 = ["Ice", "Electric", "Flying", "Psychic"]
    let tempArr2 = ["Gen 1", "Not Legendary", "Ice", "Electric", "...", "Flying", "Articuno"]

    switch(this.state.treeOperation){
      // true for generation, false for traversal
      case(true):
        return(
        <InfoSearch
        treeOp="generation"
        gen={this.state.gen}
        arrayType = "Queue"
        array = {JSON.stringify(tempArr1)}
        resultsType = "Visited"
        results={`${JSON.stringify(["Gen 1", "Legendary"])}`}
        onClick1={() => this.setState({gen: '1'})}
        onClick123={() => this.setState({gen: '123'})}
        />
        )
      case(false):
          return(
          <InfoSearch
            treeOp="traversal"
            arrayType = "Full Path"
            
            array = {this.state.traversalPath.length > 0 ? JSON.stringify([
              this.state.traversalPath.slice(0,3)[0],
              this.state.traversalPath.slice(0,3)[1],
              this.state.traversalPath.slice(0,3)[2],
               "...", ...this.state.traversalPath.slice(-3,-1), 
               this.state.traversalPath.slice(-1)[0] 
            ]):[]}
            resultsType = "Search"
            results={
                <div id="search-flexbox">
                  <div id="input-container">
                  <input type="text" 
                         value={this.state.searchInput} 
                         onChange={this.handleInput} 
                          />
                  </div>
                  <div className="text-button">OK</div>
                  <div className="text-button" 
                       onClick={() => {
                       this.setState({searchInput: '', traversalPath: []});
                       d3.select('svg').remove();
                       }}>CLEAR
                  </div>
                </div>
            }
            />
          )
    }
  }

  handleInput = event => {
    this.setState({searchInput: event.target.value});
  }

  treeClick = newState => {
    this.setState({treeOperation: newState});
  }

  renderTree = () => {
    // return(
    //   <RadialTree />
    // );
    console.log('button clicked');
  };

  drawTree = (genType) => {

          switch(this.state.treeOperation){
            case(true):
              return this.drawGenerate(genType);
            case(false):
              return this.drawTraversal(genType);
          }
    
  }

  render = () => { 
    return ( 
      <div>
        <Header 
          onClick1={() => this.treeClick(true)}
          onClick2={() => this.treeClick(false)}
        />
        {this.renderInfoSearch()}
        <div id="below-info-box">
          <div id="button-flexbox">
            <Button treeType="BFS" onClick={() => this.drawTree('bfs')}/>
            <Button treeType="DFS" onClick={() => this.drawTree('dfs')}/>
        </div>
        </div>
        </div>

     );
  }
}
 
export default App;