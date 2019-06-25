// file upload config
const fs = require('fs-extra')
const os = require('os');
const path = require('path');

const tmp = require("tmp")

module.exports = ({ router }) => {
    
    // upload images
    router.post('/images', async (ctx, next) => {
        const tmpDir = await new Promise(async (resolve, reject) => {
            tmp.dir((err, tmpDir, cleanupCallback) => {
                if(err) {
                    throw new Error(err)
                } else {
                    resolve(tmpDir)
                }
            })
        })
        const file = ctx.request.files[0]
        console.log('Dir: ', tmpDir);
        const reader = fs.createReadStream(file.path);
        const stream = fs.createWriteStream(tmpDir + "/" + file.name);
        reader.pipe(stream);
        console.log('uploading %s -> %s', file.name, stream.path);
        ctx.status = 200;
        ctx.body = {
            filename: file.name,
            tmpDir: tmpDir
        }
    });
    
    // delete all temporary images
    router.del("/images", async (ctx, next) => {
        try {
            await fs.emptyDir(path.join(__dirname, "/../../public/assets/tempImages/"))
            ctx.body = "successfully emptied temporary image folder"
        }
        catch(error) {
            throw new Error("Error emptying temporary folder");
        }
    })
};