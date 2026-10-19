import fs from 'node:fs'; import path from 'node:path';
import sharp from 'sharp';
const SRC='C:/Users/pc/AppData/Local/Temp/claude/c--Users-pc-Desktop-silver-one/81f576a4-0b7d-4d0f-bc1e-80aa93a4b3f5/scratchpad/media';
const PUB='C:/Users/pc/Desktop/silver-one/public';
let copied=0, resized=0, savedBytes=0;
async function walk(dir, rel){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const sp=path.join(dir,e.name);
    if(e.isDirectory()){ await walk(sp, path.posix.join(rel,e.name)); continue; }
    // map: site/assets/files/** -> assets/files/** ; site/templates/img/** -> brand/**
    let destRel;
    if(rel.startsWith('site/assets/files')) destRel = rel.replace(/^site\/assets\//,'assets/')+'/'+e.name;
    else if(rel.startsWith('site/templates/img')) destRel = 'brand/'+e.name;
    else destRel = rel+'/'+e.name;
    const dest=path.join(PUB, destRel);
    fs.mkdirSync(path.dirname(dest),{recursive:true});
    const st=fs.statSync(sp);
    const isImg=/\.(jpe?g|png)$/i.test(e.name);
    if(isImg && st.size > 3*1024*1024){
      try{
        const img=sharp(sp,{limitInputPixels:false});
        const meta=await img.metadata();
        const target = Math.min(meta.width||2400, 2400);
        const buf = /\.png$/i.test(e.name)
          ? await img.resize({width:target,withoutEnlargement:true}).png({compressionLevel:9}).toBuffer()
          : await img.resize({width:target,withoutEnlargement:true}).jpeg({quality:82,mozjpeg:true}).toBuffer();
        if(buf.length < st.size){ fs.writeFileSync(dest,buf); resized++; savedBytes+=st.size-buf.length; continue; }
      }catch{ /* unreadable or unsupported image — fall through to a plain copy */ }
    }
    fs.copyFileSync(sp,dest); copied++;
  }
}
await walk(SRC,'');
console.log('copied',copied,'resized',resized,'saved MB',(savedBytes/1048576).toFixed(1));
