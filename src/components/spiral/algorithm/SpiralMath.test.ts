import ImageCoordinate from "../model/ImageCoordinate";
import { calc_distance, transform_to_center } from "./SpiralMath";

const center_point = {x:280.5, y:210.0} as ImageCoordinate

test('Transform to center quadrant 1', () => {
    const transformed = transform_to_center(center_point,{x:288.5, y:200.0} as ImageCoordinate);
    expect(transformed).toStrictEqual({x:8,y:10} as ImageCoordinate);
});

test('Transform to center quadrant 2', () => {
    const transformed = transform_to_center(center_point,{x:250.5, y:100.0} as ImageCoordinate);
    expect(transformed).toStrictEqual({x:-30,y:110} as ImageCoordinate);
});

test('Transform to center quadrant 3', () => {
    const transformed = transform_to_center(center_point,{x:270.5, y:290.0} as ImageCoordinate);
    expect(transformed).toStrictEqual({x:-10,y:-80} as ImageCoordinate);
});

test('Transform to center quadrant 4', () => {
    const transformed = transform_to_center(center_point,{x:287, y:288.0} as ImageCoordinate);
    expect(transformed).toStrictEqual({x:6.5,y:-78} as ImageCoordinate);
});

test('Calc distance quadrant 1', () => {
    const transformed = calc_distance({x:19.5, y:40} as ImageCoordinate);
    expect(transformed).toBeCloseTo(44.5,4);
});

test('Calc distance quadrant 2', () => {
    const transformed = calc_distance({x:1, y:-1} as ImageCoordinate);
    expect(transformed).toBeCloseTo(1.4142,4);
});

test('Transform to center quadrant 3', () => {
    const transformed = calc_distance({x:-4, y:-3} as ImageCoordinate);
    expect(transformed).toBeCloseTo(5,4);
});

test('Calc distance quadrant 4', () => {
    const transformed = calc_distance({x:-1, y:1} as ImageCoordinate);
    expect(transformed).toBeCloseTo(1.4142,4);
});

