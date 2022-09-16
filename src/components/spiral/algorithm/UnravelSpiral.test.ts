import { unravel_spiral } from "./UnravelSpiral";
import sampleDrawing from './sample_drawing.json';
import sampleDrawingUnraveled from './sample_drawing_unraveled.json';
import SpiralDrawing from "../model/SpiralDrawing";

test('Unravel spiral', () => {
    const spiralDrawing = sampleDrawing as unknown as SpiralDrawing;
    const unraveld = unravel_spiral(spiralDrawing.start, spiralDrawing.imageWrapper.coordinates);
    for (let index = 0; index < unraveld.length; index++) {
        const actualValue = unraveld[index];
        const expectedValue = sampleDrawingUnraveled[index];
        try {
            expect(actualValue.theta).toBeCloseTo(expectedValue.theta, 3);
            expect(actualValue.rho).toBeCloseTo(expectedValue.rho, 3);
        } catch (e) {
            throw new Error(`Failed at index ${index}. Expected: {theta: ${expectedValue.theta}, rho: ${expectedValue.rho}} Actual: {theta: ${actualValue.theta}, rho: ${actualValue.rho}}`);
        }

    }
    expect(unraveld.length).toStrictEqual(434);
});