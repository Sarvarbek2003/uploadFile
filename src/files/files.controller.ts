import { Controller, Get, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from "@nestjs/platform-express";
import { FilesService } from './files.service';
import { Response } from "express";
import { PrismaService } from 'src/prisma/prisma.service';
import { readFileSync, writeFileSync } from 'fs';

@Controller('files')
export class FilesController {
    constructor(private service: FilesService, private prisma: PrismaService){}
    @Post('add')
    @UseInterceptors(FilesInterceptor('files'))
    async addFile (@UploadedFiles() files: any, @Res() res: Response):Promise<object>{
        if(!files || !files?.length) return res.status(400).json({status:400, message: "The file must be entered", error: "Bad request"})
        return await this.service.addfile(files,res)
    }

    @Get('get/:fileId')
    async getFile(@Param() param: {fileId}, @Res() res: Response):Promise<any>{
        try {
            if(isNaN(param.fileId)) return res.status(400).json({status: 400, message: "Params must be a number", error: "Bad request"})

            let file = await this.prisma.files.findFirst({
                where: {
                    file_id: +param.fileId
                }
            })

            if (!file) return res.status(403).json({status: 403, message:"File not found", error: 'Forbidden'})

            let filebase64 = readFileSync('files/'+ file.file_path, 'base64')
            let data = {
                file_id: file.file_id,
                file_type: file.file_type,
                file: filebase64
            }
            
            return res.status(200).json({status: 200, message: "ok", data}) 
        } catch (error) {
            console.log(error)
            return res.status(500).json({mstatus: 500, error: "Internal Server Error" })
        }
    }
}

