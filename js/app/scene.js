Declare_Any_Class( "Scene",  // An example of a displayable object that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct': function( context )
      { this.shared_scratchpad    = context.shared_scratchpad;
        shapes_in_use.branch = new Capped_Cylinder(1, 20);
        shapes_in_use.flower = new Subdivision_Sphere(6);
		
		this.define_data_members( {
			rules: [],
			matrix_stack: [],
			scale_stack: [],
			scale_amt: 0.2,
			rotate_amt: 30,
            branch_width: 0.05,
            branch_length: 1,
            flower_scale: 0.2
		} );

		this.rules["A"] = "sL[+ALF][-ALF]";

      },
    'display': function(time)
      {
        var graphics_state  = this.shared_scratchpad.graphics_state,
            branch_model_transform = mat4(),
            flower_model_transform = mat4();

        shaders_in_use[ "Default" ].activate();

        graphics_state.lights = [];
        graphics_state.lights.push(new Light(vec4(-4, 0, 5, 1), new Color(1, 1, 1), 100000));

        var branchMaterial = new Material(Color(0.5, 0.5, 0.5, 1.0), 0.4, 1, 0, 40, "img/stem.png");
        var flowerMaterial = new Material(Color(0.5, 0.5, 0.5, 1.0), 0.4, 1, 0, 40, "img/flower.jpg");

        ///////////////////////////////////////////////////////////////////////
        //                    GENERATE L SYSTEM TO GIVEN DEPTH               //
        // ////////////////////////////////////////////////////////////////////
        var l_system = this.generate_system("A", 3);
        //console.log(l_system);
        //var l_system = "LF+LF+LF";
        //var l_system = "sL[+ALF][-ALF]";

        ///////////////////////////////////////////////////////////////////////
        //                          RENDER L SYSTEM                          //
        // ////////////////////////////////////////////////////////////////////

		// generate tree
		var m_scale = 1;
		var m_matrix = mat4();

		for (var x = 0; x < l_system.length; x++) {
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
					m_matrix = this.matrix_pop();
					m_scale = this.scale_pop();
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
      },

	'set_formula': function(ruleID, rule) {
		this.rules[ruleID] = rule;
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
	}

  }, Animation );
