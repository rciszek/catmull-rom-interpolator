/*
Interpolator for polygons and open curves 
Author: rciszek
*/

	
/*
Interpolates a polygon or a curve using Catmull-Rom interpolation. 

Parameters:
	coordinates - Coordinates of the points as a two-dimensional array of x and y coordinates. For a polygon, the points are assumed to in a clockwise order along the contour.
	alpha - Alpha value of Catmull-Rom spline ( between 0-1 ).
	resolution - The number of points to add into the segments between the original points.
	polygon - Should the coordinates be treated as a polygon and the ends closed.
Returns:
	Interpolated coordinates as a two dimensional array.
*/
'use strict';
module.exports = function catmulRomInterpolation(coordinates, alpha=0, resolution=10, isPolygon=false) {



	//Calculate the number of cells required to store the interpolation results.
	var nInterpolated = (coordinates.length-3)*2*resolution + (coordinates.length-2)*2 ; 
	if (isPolygon) {
		nInterpolated = coordinates.length*2 * resolution + coordinates.length*2;
	}

	//Pre-allocate an array for the interpolated coordinates
	var interpolated = new Float32Array(nInterpolated);
	var interpolationIndex = 0;

	var points = coordinates.map(function(arr) {
	    return arr.slice();
	});


	//If the points define a polygon, use the last point of the original array as the first point and the two first points of the original array as the last two points.
	if ( isPolygon ) {
		points.unshift(coordinates[coordinates.length - 1]);
		points.push(coordinates[0],coordinates[1]); 
	}

	//Interpolate all segments
	for ( var i = 0; i < points.length - 3 ; i++ ) {
		calculateSpline(points[i], points[i+1], points[i+2], points[i+3],alpha,resolution);
	}

	//Calculates the spline
	function calculateSpline(p0, p1, p2, p3, alpha, resolution){

		function tValue(ti, pi, pj){		
			var xi = pi[0];
			var yi = pi[1]; 
			var xj = pj[0];
			var yj = pj[1];
			return Math.pow(  Math.pow( (xj-xi)*(xj-xi) + (yj-yi)*(yj-yi),0.5 ),alpha) + ti;
		}

		var t0 = 0;
		var t1 = tValue(t0, p0, p1);
		var t2 = tValue(t1, p1, p2);
		var t3 = tValue(t2, p2, p3);

	 	var t = [];
		//Calculate value t value for each added point
		t = linearInterpolation(t1,t2, resolution);
		var a1x,a1y,a2x,a2y,a3x,a3y,b1x,b1y,b2x,b2y,cx,cy = 0;

		//Calculate coordinates for each added point
		for ( var i = 0; i < t.length; i++) {

			a1x = (t1-t[i])/(t1-t0)*p0[0] + (t[i]-t0)/(t1-t0)*p1[0];
			a1y = (t1-t[i])/(t1-t0)*p0[1] + (t[i]-t0)/(t1-t0)*p1[1];
			a2x = (t2-t[i])/(t2-t1)*p1[0] + (t[i]-t1)/(t2-t1)*p2[0];
			a2y = (t2-t[i])/(t2-t1)*p1[1] + (t[i]-t1)/(t2-t1)*p2[1];

			a3x = (t3-t[i])/(t3-t2)*p2[0] + (t[i]-t2)/(t3-t2)*p3[0];
			a3y = (t3-t[i])/(t3-t2)*p2[1] + (t[i]-t2)/(t3-t2)*p3[1];

			b1x = (t2-t[i])/(t2-t0)*a1x + (t[i]-t0)/(t2-t0)*a2x;
			b1y = (t2-t[i])/(t2-t0)*a1y + (t[i]-t0)/(t2-t0)*a2y;
			b2x = (t3-t[i])/(t3-t1)*a2x + (t[i]-t1)/(t3-t1)*a3x;
			b2y = (t3-t[i])/(t3-t1)*a2y + (t[i]-t1)/(t3-t1)*a3y;

			cx  = (t2-t[i])/(t2-t1)*b1x + (t[i]-t1)/(t2-t1)*b2x;
			cy  = (t2-t[i])/(t2-t1)*b1y + (t[i]-t1)/(t2-t1)*b2y;

			interpolated[interpolationIndex++] = cx;				
			interpolated[interpolationIndex++] = cy;
		}
	}
	//For line, add the end point
	if (!isPolygon) {
		interpolated[interpolationIndex++] = coordinates[coordinates.length - 2][0];
		interpolated[interpolationIndex++] = coordinates[coordinates.length - 2][1];
	}

	//Transform result array to 2d array
	return arrayTo2d(interpolated,2);
};


//Perform linear interpolation from value p1 to value p2. Parameter 'resolution' sets the number of interpolated points.
function linearInterpolation( p1,p2,resolution ) {

	//Pre-allocate array for the results.
	var interpolated = new Float32Array(resolution+1);
	interpolated[0] = p1;

	var interval = (p2 - p1) / (resolution+1);
	var i = 1;
	for ( ; i < resolution+1; i++ ) {
		interpolated[i] = interpolated[i-1] + interval;
	}	
	
	return interpolated;
}

//Transforms a list into a matrix with m columns. 
function arrayTo2d(array, m) {
	var matrix = [];
 	var k = -1;
	for ( var i = 0; i < array.length; i++) {
		if (i % m === 0) {
		    k++;
		    matrix[k] = [];
		}
		matrix[k].push(array[i]);
	}
	return matrix;
}
