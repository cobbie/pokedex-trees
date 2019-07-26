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
      treeOperation: 0,
      searchInput: '',
      traversalPath: [],
      isTree: false,
      gen: '1',
      twoButtons: true,

      // informed
      startInput: '',
			endInput: '',
			startPoke: '',
			endPoke: ''
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
      case(0):
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
      case(1):
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
        case(2):
            return(
              <InfoSearch
            treeOp="informed"
            arrayType = "Full Path"
            
            array = {this.state.traversalPath.length > 0 ? JSON.stringify([
              this.state.traversalPath.slice(0,3)[0],
              this.state.traversalPath.slice(0,3)[1],
              this.state.traversalPath.slice(0,3)[2],
               "...", ...this.state.traversalPath.slice(-3,-1), 
               this.state.traversalPath.slice(-1)[0] 
            ]):[]}
            resultsType1 = "Start Pokemon"
            resultsType2 = "End Pokemon"
            results1={
                <div id="search-flexbox">
                  <div id="input-container">
                  <input type="text" 
                         value={this.state.startInput} 
                         name="startInput"
                         onChange={this.handleInformedInput} 
                          />
                  </div>
                  <div className="text-button">OK</div>
                  <div className="text-button" 
                       onClick={() => {
                       this.setState({startInput: '',});
                       d3.select('svg').remove();
                       }}>CLEAR
                  </div>
                </div>
            }
            results2={
                <div id="search-flexbox">
                  <div id="input-container">
                  <input type="text" 
                         value={this.state.endInput} 
                         name="endInput"
                         onChange={this.handleInformedInput} 
                          />
                  </div>
                  <div className="text-button">OK</div>
                  <div className="text-button" 
                       onClick={() => {
                       this.setState({endInput: ''});
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

  treeClick = (newState, twoButtons=true) => {
    this.setState({treeOperation: newState, twoButtons: twoButtons});
  }

  renderTree = () => {
    // return(
    //   <RadialTree />
    // );
    console.log('button clicked');
  };

  drawTree = (genType) => {

          switch(this.state.treeOperation){
            case(0):
              return this.drawGenerate(genType);
            case(1):
              return this.drawTraversal(genType);
          }
    
  }



  ///// integrate informed search ///// 

  handleInformedInput = event => this.setState({[event.target.name]:event.target.value});
	traverseTree = event => {
		// event.preventDefault();
		// this.startPoke = `${this.state.startInput.charAt(0).toUpperCase()}${this.state.startInput.slice(1).toLowerCase()}`;
		// this.endPoke = `${this.state.endInput.charAt(0).toUpperCase()}${this.state.endInput.slice(1).toLowerCase()}`
		this.setState({
			startPoke: `${this.state.startInput.charAt(0).toUpperCase()}${this.state.startInput.slice(1).toLowerCase()}`,
			endPoke: `${this.state.endInput.charAt(0).toUpperCase()}${this.state.endInput.slice(1).toLowerCase()}`}, () => this.draw())
	}

  draw = () => {
		d3.json("./poke-node-link.json").then(graph => {
			var svg = d3.select("body").append("svg"),
				width = +svg.attr("width"),
				height = +svg.attr("height");

			var color = d3
				.scaleOrdinal()
				.range([
					"#A8A77A",
					"#B6A136",
					"#EE8130",
					"#F95587",
					"#7AC74C",
					"#735797",
					"#6390F0",
					"#96D9D6",
					"#C22E28",
					"#F7D02C",
					"#A6B91A",
					"#A33EA1",
					"#705746",
					"#B7B7CE",
					"#6F35FC",
					"#E2BF65",
					"#A98FF3",
					"#D685AD"
				]);

			var radius = d3.scaleSqrt().range([0, 6]);

			var simulation = d3
				.forceSimulation()
				.force(
					"link",
					d3
						.forceLink()
						.id(function(d) {
							return d.id;
						})
						.distance(function(d) {
							return radius(d.source.size * 5) + radius(d.target.size * 5);
						})
						.strength(function(d) {
							return 0.75;
						})
				)
				.force("charge", d3.forceManyBody().strength(-300))
				.force(
					"collide",
					d3.forceCollide().radius(function(d) {
						return radius(d.size * 10) + 2;
					})
				)
				.force("center", d3.forceCenter(width / 2, height / 2));

			// for zoom
			var group = svg.append("g").attr("class", "group");

			var link = group
				.append("g")
				.attr("class", "links")
				.selectAll("path")
				.data(graph.links)
				.enter()
				.append("svg:path")
				.attr("stroke-width", function(d) {
					return 1;
				})
				.attr("class", function(d) {
					return "link-" + d.id;
				});

			link
				.style("fill", "none")
				.style("stroke", "black")
				.style("stroke-width", ".5px");

			link // not showing, only in views
				.append("text")
				.attr("dy", "1em")
				.attr("text-anchor", "start")
				.text(function(d) {
					return d.dist;
				})
				.style("fill", "black");

			var node = group
				.append("g")
				.attr("class", "nodes")
				.selectAll("g")
				.data(graph.nodes)
				.enter()
				.append("g")
				.attr("class", function(d) {
					return "node-" + d.id;
				})
				.style("transform-origin", "50% 50%")
				.call(
					d3
						.drag()
						.on("start", dragstarted)
						.on("drag", dragged)
						.on("end", dragended)
				);

			node
				.append("circle")
				.attr("r", function(d) {
					return radius(d.size * 5);
				})
				.attr("fill", function(d) {
					return color(d.group);
				});

			node
				.append("text")
				.attr("dy", ".35em")
				.attr("text-anchor", "middle")
				.text(function(d) {
					return d.name;
				});

			simulation.nodes(graph.nodes).on("tick", ticked);

			simulation.force("link").links(graph.links);

			// zoom function
			var zoom_handler = d3.zoom().on("zoom", zoom_actions);
			zoom_handler(svg);

			function zoom_actions() {
				group.attr("transform", d3.event.transform);
			}

			var zoomer = group
				.append("rect")
				.call(zoom_handler)
				.call(zoom_handler.transform, d3.zoomIdentity.scale(0.5, 0.5).translate(600, 600));

			function ticked() {
				link.attr("d", function(d) {
					var dx = d.target.x - d.source.x,
						dy = d.target.y - d.source.y,
						dr = Math.sqrt(dx * dx + dy * dy);
					return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
				});

				node.attr("transform", function(d) {
					return "translate(" + d.x + "," + d.y + ")";
				});
			}

			function dragstarted(d) {
				if (!d3.event.active) simulation.alphaTarget(0.3).restart();
				d.fx = d.x;
				d.fy = d.y;
			}

			function dragged(d) {
				d.fx = d3.event.x;
				d.fy = d3.event.y;
			}

			function dragended(d) {
				if (!d3.event.active) simulation.alphaTarget(0);
				d.fx = null;
				d.fy = null;
			}

			// function click() {
			// 	d3.select(this)
			// 		.select("circle")
			// 		.transition()
			// 		.style("stroke", "red");
			// }
			// node.on("click", click);

			// informed search
			// test nodes
			const start = this.state.startPoke ? this.state.startPoke : "Gyarados";
      const end = this.state.endPoke ? this.state.endPoke : "Butterfree";
      console.log(`start: ${start}, end: ${end}`)
			// var start = "Gyarados";
			// var end = "Butterfree";
			var visitElement = function(element, animate) {
				d3.select(".node-" + element.id)
					.select("circle")
					.transition()
					.duration(250)
					.delay(250 * animate)
					.style("fill", "gray")
					.style("stroke", "gray");
			};

			var visitGoal = function(element, animate) {
				d3.select(".node-" + element.id)
					.select("circle")
					.transition()
					.duration(250)
					.delay(250 * animate)
					.style("fill", "blue")
					.style("stroke", "blue");

				graph.links.forEach(getId => {
					if (element.id === getId.source.id) {
						d3.select("path.link-" + getId.id)
							.transition()
							.duration(250)
							.delay(250 * animate)
							.style("fill", "none")
							.style("stroke", "blue")
							.style("stroke-width", "3px");
					}
				});
			};

			var nodes = [];
			var dataBinding = data => {
				var nodesByName = {};
				graph.nodes.forEach(d => {
					var name = d.name;
					if (!nodesByName[name]) {
						var node = {
							name: name,
							links: [],
							type1: d.type1,
							type2: d.type2
						};
						nodesByName[name] = node;
						nodes.push(node);
					}
				});

				graph.links.forEach(d => {
					nodes.forEach(n => {
						var l = {
							source: d.source,
							target: d.target,
							value: d.dist,
							id: d.id
						};
						if (n.name === d.source.name) {
							n["links"].push(l);
						}
						if (n.name === d.source.type1 && n.name === l.target) {
							n["links"].push(l);
						}
					});
				});
			};
			dataBinding(graph);

			class QElement {
				constructor(element, priority) {
					this.element = element;
					this.priority = priority;
				}
			}
			class PriorityQueue {
				constructor() {
					this.items = [];
				}

				enqueue(element, priority) {
					var qElement = new QElement(element, priority);
					var contain = false;

					for (var i = 0; i < this.items.length; i++) {
						if (this.items[i].priority > qElement.priority) {
							this.items.splice(i, 0, qElement);
							contain = true;
							break;
						}
					}

					if (!contain) {
						this.items.push(qElement);
					}
				}

				dequeue() {
					if (this.isEmpty()) return "Underflow";
					return this.items.shift();
				}

				isEmpty() {
					return this.items.length === 0;
				}
			}

			var dijkstra = (data, start, end) => {
				var pq = new PriorityQueue();
				let prev = {};
				let distances = {};
				let source, goal, goalType;
				let path = [],
					link = [];
				let animate = 0;

				data.forEach(node => {
					if (start === node.name) {
						source = node;
					}
					if (end === node.name) {
						goal = node;
					}
				});
				data.forEach(node => {
					if (goal.type1 === node.name) {
						goalType = node;
					}
				});

				distances[source.name] = 0;
				pq.enqueue(source, 0);
				path.push({ name: source.name, distance: distances[source.name] });
				graph.nodes.forEach(gn => {
					if (gn.name === source.name) {
						visitElement(gn, animate);
					}
				});

				data.forEach(node => {
					if (node.name !== source.name) {
						distances[node.name] = Infinity;
					}
					prev[node.name] = null;
				});

				while (!pq.isEmpty()) {
					let minNode = pq.dequeue();
					animate += 1;
					let currNode = minNode.element;
					// console.log(currNode);

					if (currNode === goal) {
						path.forEach(p => {
							graph.nodes.forEach(gn => {
								if (p.name === gn.name) {
									visitGoal(gn, animate);
								}
							});
						});

						console.log("found");
						break;
					}
					// else {
					// 	console.log("not found");
					// }

					currNode.links.forEach(neighbor => {
						data.forEach(node => {
							if (neighbor.target.name === node.name) {
								let alt = distances[currNode.name] + neighbor.value;
								if (alt < distances[neighbor.target.name]) {
									distances[neighbor.target.name] = alt;
									prev[neighbor.target.name] = currNode;
									pq.enqueue(node, distances[neighbor.target.name]);
									// console.log(node);
									graph.nodes.forEach(gn => {
										if (gn.name === node.name) {
											visitElement(gn, animate);
										}
									});

									if (neighbor.target.name === node.name && source.type1 === neighbor.target.name) {
										path.push({ name: node.name, distance: distances[node.name] });
									} else if (goal.name === node.name && goal.type1 === neighbor.source.name) {
										path.push({ name: node.name, distance: distances[node.name] });
									}

									// console.log(neighbor.target.type2 + " "+ goal.type1)
									// console.log(neighbor.target);
									if (neighbor.target.type2 === goal.type1 && neighbor.target.type1 === source.type1) {
										let alt = distances[node.name];
										if (alt < distances[goalType.name]) {
											distances[goalType.name] = alt;
											prev[goalType.name] = node;
											pq.enqueue(goalType, distances[goalType.name]);
											path.push({
												name: node.name,
												distance: distances[node.name]
											});
											path.push({
												name: goalType.name,
												distance: distances[goalType.name]
											});
										}
									} else if (neighbor.target.name === goal.type1 || neighbor.target.name === goal.type2) {
										let alts = distances[node.name];
										if (alts < distances[goalType.name]) {
											distances[goalType.name] = alts;
											prev[goalType.name] = node;
											pq.enqueue(goalType, distances[goalType.name]);
											path.push({
												name: node.name,
												distance: distances[node.name]
											});
											// path.push({
											// 	name: goalType.name,
											// 	distance: distances[goalType.name]
											// });
										}
									}

									if (node.type1 === goal.type1) {
										path.push({
											name: node.name,
											distance: distances[node.name]
										});
									}
								}
							}
						});
					});

					if (pq.items.length === 0) {
						// console.log('pass')
						link.forEach(item => {
							let alt = distances[item.name];
							if (alt < distances[goalType.name]) {
								distances[goalType.name] = alt;
								prev[goalType.name] = item;
								pq.enqueue(goalType, distances[goalType.name]);
								path.push({ name: item.name, distance: distances[item.name] });

								graph.nodes.forEach(gn => {
									if (gn.name === goalType.name) {
										visitElement(gn, animate);
									}
								});
							}
						});
						path.push({ name: goalType.name, distance: distances[goalType.name] });
						for (let i = 1; i < path.length; i++) {
							if (path[i - 1].distance === path[i].distance) {
								path.splice(i - 2, 1);
							}
						}
					}
				}

				for (let i = 1; i < path.length; i++) {
					if (path[i].name === goal.name) {
						console.log(path[i]);
						path.splice(i + 1);
					}
				}

				console.log(path);
			};

			dijkstra(nodes, start, end);
		});
  };
  removeSvg = () => {
    d3.select('svg').remove();
  }
  
  renderButtons = () => {
    if(this.state.twoButtons===true){
      return(
        <div id="button-flexbox">
            <Button buttonText="Create BFS Tree" onClick={() => this.drawTree('bfs')}/>
            <Button buttonText="Create DFS Tree" onClick={() => this.drawTree('dfs')}/>
        </div>
      )}
      else if(this.state.twoButtons===false){
        return(
          <div id="button-flexbox">
            <Button buttonText="Create Graph" onClick={() => {
              this.traverseTree()
              }}/>
            <Button buttonText="Reset" onClick={() => {
              this.setState({
              startInput: '',
              endInput: '',
              startPoke: '',
              endPoke: ''
              }, () => this.removeSvg());
              
              }}/>
              
        </div>
        )
      }
    }
  

  render = () => { 
    return ( 
      <div>
        <Header 
          onClick1={() => this.treeClick(0)}
          onClick2={() => this.treeClick(1)}
          onClick3={() => this.treeClick(2, false)}
        />
        {this.renderInfoSearch()}
        <div id="below-info-box">
          {this.renderButtons()}
        </div>
        </div>

     );
  }
}
 
export default App;