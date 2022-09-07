import SpiralDrawing from '../model/SpiralDrawing';
import sampleDrawing from './sample_drawing.json'; 

import SpiralRating from './SpiralRating';

jest.mock('@capacitor-community/bluetooth-le');

const ratingAlgorithm = new SpiralRating();

test('Rate drawing', () => {
    const rating = ratingAlgorithm.rate(sampleDrawing as unknown as SpiralDrawing);
    console.log(rating);
    expect(rating.dataPoints).toEqual(434);
    expect(rating.firstOrderSmoothness).toBeCloseTo(6.32669, 4);
    expect(rating.secondOrderSmoothness).toBeCloseTo(15.40331, 4);
    expect(rating.thightness).toBeCloseTo(6.95695, 4);
    expect(rating.zeroCrossingRate).toBeCloseTo(0.03226, 4);
});
