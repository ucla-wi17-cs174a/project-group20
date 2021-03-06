Declare_Any_Class( "Scene",  // An example of a displayable object that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct': function( context )
      { this.shared_scratchpad    = context.shared_scratchpad;
        shapes_in_use.branch = new Capped_Cylinder(1, 6);
        shapes_in_use.flower = new Shape_From_File("https://ucla-wi17-cs174a.github.io/project-group20/assets/flower.obj");

		this.define_data_members( {
			rules: [],
			matrix_stack: [],
			scale_stack: [],
            formula_rest: false,

            depth: depthInput,
            new_formula: false,
			scale_amt: scaleInput, // S / s scale amount (0 - 0.5)
			rotate_amt: branchAngleInput, // branch angle (0 - 180)
            branch_width: branchWidthInput, // radius of branch (0.01 - 0.5)
            branch_length: branchLengthInput, // length of branch (0.5 - 5)
            flower_scale: flowerSizeInput, // size of flowers (0.1 - 0.5)
            global_rotation: 0, // current angle
            rotation_speed: rotationSpeedInput, // rotation speed of the tree in degrees/sec (0 - 90)
            flower_color: flowerColorInput, // 'blue' 'red' 'yellow'
            branch_color: branchColorInput, // 'brown' 'green'
            materials: []

		} );

        this.materials['red'] = new Material(Color(0.5, 0.5, 0.5, 1.0), 0.4, 1, 0.4, 10, "img/flower_red.jpg");
        this.materials['yellow'] = new Material(Color(0.5, 0.5, 0.5, 1.0), 0.4, 1, 0.4, 10, "img/flower_yellow.jpg");
        this.materials['blue'] = new Material(Color(0.5, 0.5, 0.5, 1.0), 0.4, 1, 0.4, 10, "img/flower_blue.jpg");
        this.materials['green'] = new Material(Color(0.5, 0.5, 0.5, 1.0), 0.4, 1, 0.4, 10, "img/branch_green.png");
        this.materials['brown'] = new Material(Color(0.5, 0.5, 0.5, 1.0), 0.4, 1, 0.4, 10, "img/branch_brown.jpg");

		this.rules["A"] = "sL[*[+ALF][-ALF]][/[+ALF][-ALF]]";
      },
    'display': function(time)
      {
        this.reset_stacks();

        if (this.formula_reset && this.new_formula) {
            this.formula_reset = true;
        }
        else {
            this.formula_reset = false;
            if (this.new_formula && !this.formula_reset) {
                this.set_formula("A", document.getElementById("formula").value);
            }
        }

        this.new_formula = newFormulaInput;

      	this.scale_amt = 0.5-scaleInput;
      	this.flower_scale = flowerSizeInput;
      	this.rotate_amt = branchAngleInput;
      	this.branch_width = branchWidthInput;
      	this.branch_length = branchLengthInput;
      	this.rotation_speed = rotationSpeedInput;
        this.flower_color = flowerColorInput;
        this.branch_color = branchColorInput;
        this.depth = depthInput;

        var graphics_state  = this.shared_scratchpad.graphics_state,
            branch_model_transform = mat4(),
            flower_model_transform = mat4();

        shaders_in_use[ "Default" ].activate();

        graphics_state.lights = [];
        graphics_state.lights.push(new Light(vec4(-4, 0, 5, 1), new Color(255/255, 147/255, 41/255), 100));

        var branchMaterial = this.materials['brown'];
        var flowerMaterial = this.materials['red'];

        // Select flower color
        if (this.flower_color == 'red') {
            flowerMaterial = this.materials['red'];
        }
        if (this.flower_color == 'yellow') {
            flowerMaterial = this.materials['yellow'];
        }
        if (this.flower_color == 'blue') {
            flowerMaterial = this.materials['blue'];
        }

        // Select branch color
        if (this.branch_color == 'brown') {
            branchMaterial = this.materials['brown'];
        }
        if (this.branch_color == 'green') {
            branchMaterial = this.materials['green'];
        }

        ///////////////////////////////////////////////////////////////////////
        //                    GENERATE L SYSTEM TO GIVEN DEPTH               //
        ///////////////////////////////////////////////////////////////////////
        var l_system = this.generate_system("A", this.depth);

        ///////////////////////////////////////////////////////////////////////
        //                          RENDER L SYSTEM                          //
        ///////////////////////////////////////////////////////////////////////

		var m_scale = 1;

        // Tree rotation
        var d = 0.001 * this.shared_scratchpad.graphics_state.animation_delta_time;
        this.global_rotation = (this.global_rotation + this.rotation_speed*d) % 360;
		var m_matrix = rotation(this.global_rotation, [0, 1, 0]);
        m_matrix = mult(translation(0, -4, 2), m_matrix);

		// Generate Tree
		for (var x = 0; x < l_system.length; x++) {
            if (this.formula_reset)
                break;

			var c = l_system[x];
			switch(c) {
				case "":
					break;

				case "A":
				case "B":
				case "C":
				case "D":
				case "E":
					break;

				case "[":
					this.state_push(m_matrix, m_scale);
					break;
				case "]":
                    if (this.scale_stack.length == 0 || this.matrix_stack.length == 0) {
                        alert("Invalid formula, formula is cleared");
                        this.set_formula("A", "");
                        this.formula_reset = true;
                    }
                    else {
                        m_matrix = this.matrix_pop();
                        m_scale = this.scale_pop();
                    }
					break;

				case "F":
					flower_model_transform = m_matrix;

//                    flower_model_transform = mult(flower_model_transform, translation(0, 0, 1));
                    flower_model_transform = mult(flower_model_transform, scale(this.flower_scale, this.flower_scale, this.flower_scale));
                    shapes_in_use.flower.draw(graphics_state, flower_model_transform, flowerMaterial);

                    m_matrix = mult(m_matrix, translation(0, 0.5*this.flower_scale, 0));
					break;
				case "L":
                    branch_model_transform = m_matrix;

                    branch_model_transform = mult(branch_model_transform, rotation(90, vec3(1, 0, 0)));
                    branch_model_transform = mult(branch_model_transform, translation(0, 0, -0.5*this.branch_length));
                    branch_model_transform = mult(branch_model_transform, scale(this.branch_width, this.branch_width, this.branch_length));
                    shapes_in_use.branch.draw(graphics_state, branch_model_transform, branchMaterial);

                    m_matrix = mult(m_matrix, translation(0, this.branch_length, 0));

					// state_push(m_matrix, m_scale);
					// m_matrix = mult(m_matrix, scale(m_scale, m_scale, m_scale));
					// model_transform = m_matrix;
					// stem.draw();
					// m_matrix = matrix_pop();
					// m_scale = scale_pop();
					// m_matrix = mult(translation(0,1,0), m_matrix);
					break;
				case "s":
					m_matrix = mult(m_matrix, scale(1-this.scale_amt, 1-this.scale_amt, 1-this.scale_amt));
					break;
				case "S":
					m_matrix = mult(m_matrix, scale(1+this.scale_amt, 1+this.scale_amt, 1+this.scale_amt));
				  break;
				case "+":
					m_matrix = mult(m_matrix, rotation(this.rotate_amt, [0, 0, 1]));
					break;
				case "-":
					m_matrix = mult(m_matrix, rotation(-this.rotate_amt, [0, 0, 1]));
					break;
				case "<":
					m_matrix = mult(m_matrix, rotation(this.rotate_amt, [0, 1, 0]));
					break;
				case ">":
					m_matrix = mult(m_matrix, rotation(-this.rotate_amt, [0, 1, 0]));
					break;
				case "*":
					m_matrix = mult(m_matrix, rotation(this.rotate_amt, [1, 0, 0]));
					break;
				case "/":
					m_matrix = mult(m_matrix, rotation(-this.rotate_amt, [1, 0, 0]));
					break;

				default:
					break;
			}
		}
        this.reset_stacks();
      },

	'set_formula': function(ruleID, rule) {
		this.rules[ruleID] = rule;				//  + "." ?
	},

	'generate_system': function(init_string, depth) {
		var str = init_string;
		for (var d = 0; d < depth; d++) {
			var temp = "";
			for (var k = 0; k < str.length; k++) {
				if (str[k] in this.rules) {
					temp += this.rules[str[k]];
				}
				else
					temp += str[k];
			}
			str = temp;
		}
		return str;
	},
	'state_push': function(matrix, scale) {
		this.matrix_stack.push(matrix);
		this.scale_stack.push(scale);
	},
	'matrix_pop': function() {
        return this.matrix_stack.pop();
	},
	'scale_pop': function() {
		return this.scale_stack.pop();
	},
    'reset_stacks': function() {
        this.matrix_stack = [];
        this.scale_stack = [];
    }

  }, Animation );
