import ImageCoordinate from "../model/ImageCoordinate";
import PolarCoordinate from "../model/PolarCoordinate";
import { unravel_spiral } from "./UnravelSpiral";

test('Unravel spiral', () => {
    const center_point = {x:308, y:198} as ImageCoordinate;
    const coordinates = [
        {x:308, y:198} as ImageCoordinate,
        {x:307, y:180} as ImageCoordinate,
        {x:271, y:199} as ImageCoordinate,
        {x:309, y:253} as ImageCoordinate,
    ]

    const unraveld = unravel_spiral(center_point,coordinates);
    expect(unraveld[0]).toStrictEqual({theta:0,rho:0} as PolarCoordinate);
    expect(unraveld[1].theta).toBeCloseTo(3.1798, 3);
    expect(unraveld[2].theta).toBeCloseTo(1.5481, 3);
    expect(unraveld[3].theta).toBeCloseTo(1.0416, 3);
});