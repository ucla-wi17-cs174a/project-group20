Declare_Any_Class( "Scene",  // An example of a displayable object that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct': function( context )
      { this.shared_scratchpad    = context.shared_scratchpad;
        shapes_in_use.branch = new Capped_Cylinder(1, 8);
        
      },
    'display': function(time)
      {
        var graphics_state  = this.shared_scratchpad.graphics_state,
            model_transform = mat4();             // We have to reset model_transform every frame, so that as each begins, our basis starts as the identity.
        shaders_in_use[ "Default" ].activate();

        //graphics_state.lights.push( new Light( vec4(  30*light_orbit[0],  30*light_orbit[1],  34*light_orbit[0], 1 ), Color( 0, .4, 0, 1 ), 100000 ) );

        var purplePlastic = new Material( Color( 0.5,0.5,0.5,1 ), .4, .4, .8, 40, "stem.png" );

        model_transform = mult(model_transform, rotation(90, vec3(1, 0, 0)));
        model_transform = mult(model_transform, scale(1, 1, 4));
        shapes_in_use.branch.draw(graphics_state, model_transform, purplePlastic);

      }
  }, Animation );
