import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { join, extname} from 'path';
import { writeFileSync, existsSync, mkdirSync} from 'fs';
import { Response } from "express";

@Injectable()
export class FilesService {
    constructor(private prisma: PrismaService){}
    async addfile(upload_files, res:Response): Promise<object> {
        try {   
            let prisma_res = []
            for(let i = 0; i < upload_files.length; i+=1){
                // регулирует расположение и имя файла
                let ext_name = extname(upload_files[i].originalname).split('.').join('')
                let d = new Date().getTime()
                let filename = `${upload_files[i].originalname.replace(/\s/g, '').split(ext_name)[0]+d}.${ext_name}`
                let fileDir = new Date(d).toLocaleDateString().split('/').join('-')
                let filepath = `${ext_name}/${fileDir}/${filename}`

                // открывает файл, если он не найден
                let exixstFile = `files/${ext_name}/${fileDir}`
                if(!existsSync(exixstFile)){
                    mkdirSync(exixstFile, { recursive: true });
                }
                writeFileSync(join(process.cwd(), 'files',filepath ), upload_files[i].buffer)

                // Записывает данные файла в базу данных
                prisma_res.push(await this.prisma.files.create({
                    data: {
                        file_name: upload_files[i].originalname,
                        file_path: filepath,
                        file_size: `${upload_files[i].size}`,
                        file_type: upload_files[i].mimetype
                    }
                }))
            } 
            return  res.status(200).json({status: 200, data: prisma_res}) 
        } catch (error) {
            return res.status(500).json({ status: 500, error: "Internal Server Error" })
        }
    }
}
