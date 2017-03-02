Declare_Any_Class( "Scene",  // An example of a displayable object that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct': function( context )
      { this.shared_scratchpad    = context.shared_scratchpad;
        shapes_in_use.branch = new Capped_Cylinder(1, 20);
        shapes_in_use.flower = new Subdivision_Sphere(6);
        
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

        branch_model_transform = mult(branch_model_transform, translation(0, -4, 5));
        branch_model_transform = mult(branch_model_transform, rotation(90, vec3(1, 0, 0)));
        branch_model_transform = mult(branch_model_transform, scale(1, 1, 6));
        shapes_in_use.branch.draw(graphics_state, branch_model_transform, branchMaterial);

        flower_model_transform = mult(flower_model_transform, translation(0, 0, 5));
        flower_model_transform = mult(flower_model_transform, scale(1.5, 1.5, 1.5));
        shapes_in_use.flower.draw(graphics_state, flower_model_transform, flowerMaterial);

      }
  }, Animation );
