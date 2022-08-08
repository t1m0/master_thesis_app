import SpiralDrawing from '../model/SpiralDrawing';
import drawingResult from './drawingResult.json'; 

import SpiralRating from './SpiralRating';

jest.mock('@capacitor-community/bluetooth-le');

const ratingAlgorithm = new SpiralRating();

test('Rate drawing', () => {
    const rating = ratingAlgorithm.rate(drawingResult as unknown as SpiralDrawing);
    console.log(rating);
    expect(rating.dataPoints).toEqual(832);
    expect(rating.firstOrderSmoothness).toBeCloseTo(7.44, 1);
    expect(rating.secondOrderSmoothness).toBeCloseTo(19.39, 1);
    expect(rating.zeroCrossingRate).toBeCloseTo(0.004, 2);
    expect(rating.thightness).toBeCloseTo(6.96, 1);
    expect(rating.degreeOfSeverity).toBeCloseTo(4.85, 1);
    expect(rating.severityLevel).toBe("Medium");
});
