const expect = require('chai').expect;
const catmullRomInterpolator = require('../src/catmull-rom-interpolator')
const expected_results = require('./expected');

describe('CRM interpolation', function() {
	describe('Polygon interpolation', function(){
		it('Interpolates a polygon using uniform spline', function() {
			var actual_result = catmullRomInterpolator([[0,0],[1,1],[2,2], [0,3], [-2,2],[-1,1] ], 0, 3, true );
			var expected_result = expected_results.polygonUniform;
			expect(actual_result).to.deep.equal(expected_result);	
		});

		it('Interpolates a polygon using centripetal spline', function() {
			var actual_result = catmullRomInterpolator([[0,0],[1,1],[2,2], [0,3], [-2,2],[-1,1] ], 0.5, 3, true );
			var expected_result = expected_results.polygonCentripetal;
			expect(actual_result).to.deep.equal(expected_result);
		});

		it('Interpolates a polygon using chordal spline', function() {
			var actual_result = catmullRomInterpolator([[0,0],[1,1],[2,2], [0,3], [-2,2],[-1,1] ], 1, 3, true );
			var expected_result = expected_results.polygonChordal;
			expect(actual_result).to.deep.equal(expected_result);
		});

	} );
	describe('Line interpolation', function() {
		it('Interpolates a line using uniform spline', function() {
			var actual_result = catmullRomInterpolator([[0,1],[1,2],[2,-1],[3,1],[4,5]], 0, 2, false );
			var expected_result = expected_results.lineUniform;
			expect(actual_result).to.deep.equal(expected_result);	
		});
		it('Interpolates a line using centripetal spline', function() {
			var actual_result = catmullRomInterpolator([[0,1],[1,2],[2,-1],[3,1],[4,5]], 0.5, 2, false );
			var expected_result = expected_results.lineCentripetal;
			expect(actual_result).to.deep.equal(expected_result);	
		});
		it('Interpolates a line using chordal spline', function() {
			var actual_result = catmullRomInterpolator([[0,1],[1,2],[2,-1],[3,1],[4,5]], 1, 2, false );
			var expected_result = expected_results.lineChordal;
			expect(actual_result).to.deep.equal(expected_result);	
		})
	});

} );
