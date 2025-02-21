import React from "react";

import { checkImage, docPath, processResult } from "../../../__tests__/setup";
import { Blur, Image } from "../../components";
import { loadImage, PIXEL_RATIO, surface } from "../setup";
import { Group } from "../../components/Group";
import { setupSkia } from "../../../skia/__tests__/setup";
import { TileMode } from "../../../skia/types";
import { fitRects } from "../../../dom/nodes";

describe("Blur Image Filter", () => {
  it("should build the reference build images for later", async () => {
    const { surface: ckSurface, Skia } = setupSkia(
      surface.width * PIXEL_RATIO,
      surface.height * PIXEL_RATIO
    );
    const canvas = ckSurface.getCanvas();
    const image = loadImage("skia/__tests__/assets/oslo.jpg");
    const imgRect = Skia.XYWHRect(0, 0, image.width(), image.height());
    const { src, dst } = fitRects("cover", imgRect, {
      x: 0,
      y: 0,
      width: surface.width,
      height: surface.height,
    });

    const m3 = Skia.Matrix();
    m3.scale(3, 3);

    const paint = Skia.Paint();
    paint.setImageFilter(Skia.ImageFilter.MakeBlur(4, 4, TileMode.Decal, null));
    canvas.save();
    canvas.concat(m3);
    canvas.drawImageRect(image, src, dst, paint);
    canvas.restore();
    processResult(ckSurface, docPath("blur.png"));
  });
  it("should blur the image with tile mode=decal", async () => {
    const { width } = surface;
    const image = loadImage("skia/__tests__/assets/oslo.jpg");
    expect(image).toBeTruthy();
    const img = await surface.draw(
      <Group>
        <Blur blur={4} />
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={width}
          fit="cover"
        />
      </Group>
    );
    checkImage(img, docPath("blur.png"));
  });
});
