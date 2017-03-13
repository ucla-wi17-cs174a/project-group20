# project-group20
CS 174A Winter 2017 Term Project  
Created by Wenlong Xiong, Adam Jones, Nathan Yang  

## Overview
This WebGL program simulates different tree growths by using Lindenmayer-systems to recursively generate the sequence of branches and "flowers" that make up a plant. Each tree is defined by several different properties - the primary ones are the base L-system formula and recursion depth. There is also the option of changing the scaling factor,  flower size, branch width, branch length, branch angle, and tree display rotation speed via sliders. 5 buttons also can change the flower color and branch color.  

Please grade tag version v1.2.

## Camera controls
```
W/A/S/D:  Pan up/left/down/right
I/O:      Zoom in/out
R:        Reset to default camera view
```

## Lindenmayer Systems  
Lindenmayer systems are a type of formal grammar that is used to transform one string into another. You can define a number of rules that transform a substring into another, an initial value, and a max depth to recurse to. To generate a final string, you start with the initial value, and for N iterations (N being the max depth), you transform  all substrings matching your rules.
For example, given the initial seed "A", the rules ("A ==> B[A]C"), and a max depth of 3, we get:  
```
  n = 0:   A
  n = 1:   B[A]C
  n = 2:   B[B[A]C]C
  n = 3:   B[B[B[A]C]C
```
Our final string at n = 3 iterations would be "B[B[B[A]C]C]C. Of course, if there were rules for B or C, the final string would be different as well. In our WebGL program however, we only use a single rule, A.    

## L-System Formula Syntax / Generating Trees
The initial seed string to be recursed on is "A". The formula text box transform the string "A" into the contexts of the text box. Once the final string is generated via our L-system recursion, we can draw a tree by intepreting the different characters in the string as actions such as "draw branch in this direction", "draw flower", "rotate direction by X degrees".
The following characters represent:   
```
L:     Draws a branch at the current point in the current direction. Moves your 'point' to the end of the branch.
F:     Draws a flower at the current point.
*, /:  Rotates your draw direction along the X axis (relative to the current direction) by X degrees.
<, >:  Rotates your draw direction along the Y axis (relative to the current direction) by X degrees.
+, -:  Rotates your draw direction along the Z axis (relative to the current direction) by X degrees.
S, s:  Increases or decreases the current scale by Y. Branch size and flower size are affected by the scale factor.
[:     Stores the current point position, draw direction, and scale factor on a stack.
]:     Loads the previously stored point position, draw direction, and scale factor from the stack.

*  (X is the branch angle, changeable by the slider)
** (Y is the scaling factor, changeable by the slider)
```
