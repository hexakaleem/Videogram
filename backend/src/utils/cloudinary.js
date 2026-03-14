import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config({ quiet: true })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error(`No Local File Path`)
      return null
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    })

    console.log(`File is Uploaded Successfully: ${response.url}`)
    fs.unlink(localFilePath, (error) => {
      if (error) {
        console.log(error)
      }
    })
    return response

  } catch (error) {
    console.log(`Error Uploading File on Cloudinary: ${error.message}`)
    fs.unlink(localFilePath, (error) => {
      if (error) {
        console.log(error)
      }
    })
    return null
  }
}

export { uploadOnCloudinary }


/*
const uploadOnCloudinary = async (
  localFilePath,
  retries = 3,
  delay = 1000
) => {
  if (!localFilePath) {
    console.error("No local file path provided")
    return null
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
      })

      console.log(`File uploaded successfully: ${response.url}`)

      fs.unlinkSync(localFilePath) // delete local file ONLY on success
      return response

    } catch (error) {
      console.error(
        `Cloudinary upload failed (attempt ${attempt}/${retries})`,
        error.message
      )

      if (attempt === retries) {
        console.error("Max retries reached. Upload failed.")
        fs.unlinkSync(localFilePath) // optional: cleanup after final failure
        throw error
      }

      await sleep(delay)
    }
  }
}
*/