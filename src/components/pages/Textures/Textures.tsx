import Page from "../../Page";
import Image from "../../Image";
import { CombinedTextureDemo, DecalDemo, TextureUVDemo } from "./TextureDemos";

import uvImage from "../../../images/CubeUVMapping.png";

// Mossy bark texture maps
import mossyBarkBase from "../../../textures/MossyBark/MossyBark02_1K_BaseColor.png";
import mossyBarkNormal from "../../../textures/MossyBark/MossyBark02_1K_Normal.png";
import mossyBarkRoughness from "../../../textures/MossyBark/MossyBark02_1K_Roughness.png";

export default function Textures() {
  return (
    <Page pageName="textures">
      <h1>Textures</h1>
      <h2>Texture Coordinates</h2>
      <Image path={uvImage} alt="UV Mapping of a cube" />
      <TextureUVDemo />
      <h2>Texture Maps</h2>
      <Image
        path={mossyBarkBase}
        alt="Base texture"
        attribution="www.cgbookcase.com"
        attribAsLink
      />
      <Image
        path={mossyBarkNormal}
        alt="Normal texture"
        attribution="www.cgbookcase.com"
        attribAsLink
      />
      <Image
        path={mossyBarkRoughness}
        alt="Roughness texture"
        attribution="www.cgbookcase.com"
        attribAsLink
      />
      <CombinedTextureDemo />
      {/* <h2>Decals</h2>
      <DecalDemo /> */}
    </Page>
  );
}
