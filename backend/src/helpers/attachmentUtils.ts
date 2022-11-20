import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

 // ##TODO: Implement the fileStogare logic
 const s3BucketName = process.env.ATTACHMENT_S3_BUCKET
 const urlExpiration = process.env.SIGNED_URL_EXPIRATION
export class AttachmentUtils {
    constructor(
      private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
      private readonly bucketName = s3BucketName
    ) {}

    getUploadUrl(attachmentId: string): string{
        console.log('func getUploadUrl called')
        const url = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: attachmentId,
            Expires: parseInt(urlExpiration)
        })

        return url as string
    }

    getAttachmentUrl(attachmentId: string){
        return `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
    }
}