import React, {useState} from 'react';
import { Form, Field } from 'react-final-form';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { toast } from 'react-toastify';
import plusIcon from './icons/add-black-48dp.svg';
import './Upload.css';

const Upload = () => {
    const [filePath, setFilePath] = useState('')
    const [duration, setDuration] = useState('')
    const [thumbnail, setThumbnail] = useState('')
      
    const onSubmit = async (values) => {
      const { title, description } = values;

      if (title === "" || description === "" || filePath === "" ||
          duration === "" || thumbnail === "") {
          toast.error(`Please first fill all the fields.`, {hideProgressBar: true});
      }

      const payload = {
        title,
        description,
        filePath,
        duration,
        thumbnail,
      }

      const uploadResponse = await axios.post('/video/create', payload);
      
      if (uploadResponse.err) {
        toast.error(`Failed to upload the video.`, {hideProgressBar: true});
        return;
      }
      
      toast.success('The video uploaded successfuly!', {hideProgressBar: true});
      setFilePath('');
      setDuration('');
      setThumbnail('');
    };
    
    const onDrop = async (files) => {

      const formData = new FormData();
      const params = {
        header: { 'content-type': 'multipart/form-data' }
      }

      formData.append("file", files[0])

      const uploadResponse = await axios.post('/video/upload', formData, params);

      if (uploadResponse.data.err) {
        toast.error(uploadResponse.data.err, {hideProgressBar: true});
        return;
      }

      const { filePath, fileName } = uploadResponse.data;
      
      const thumbnailPayload = {
          filePath,
          fileName,
      }
      setFilePath(filePath)

      const thumbnailResponse = await axios.post('/video/thumbnail', thumbnailPayload);
      
      if (thumbnailResponse.data.err) {
        toast.error(thumbnailResponse.data.err, {hideProgressBar: true});
        return;
      }
      
      const { fileDuration, thumbsFilePath } = thumbnailResponse.data;
      setDuration(fileDuration)
      setThumbnail(thumbsFilePath)
    }

    return (
      <React.Fragment>
        <div className='upload-header'>
          <p className='title'>Youtube Clone</p>
        </div>
        <section className='section-block'>
          <div className='section-content'>
            <div className='form-block'>
              <Form
                onSubmit={onSubmit}
                validate={(values) => {
                  const errors = {};

                  if (!values.title) {
                    errors.title = 'Required';
                  }
                  if (!values.description) {
                    errors.description = 'Required';
                  }

                  return errors;
                }}
                render={({
                  handleSubmit,
                  form,
                  submitting,
                  pristine,
                  values,
                }) => (
                  <form onSubmit={async event => {
                    await handleSubmit(event);
                    form.reset();
                  }}>
                    <div className="dropzone-container">
                      <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={100000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div className="add-new"
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <img src={plusIcon} alt="icon" />
                            </div>
                        )}
                      </Dropzone>

                      {thumbnail !== "" &&
                        <div className="thumbnail">
                          <img src={`http://localhost:5000/${thumbnail}`} alt="thumbnail" />
                        </div>
                      }
                    </div>
                    
                    <Field name='title'>
                      {({ input, meta }) => (
                        <div
                          className={`input-block ${
                            meta.error && meta.touched ? 'input-error' : ''
                          }`}
                        >
                          <label>Title *</label>
                          <input {...input} type='text' />
                        </div>
                      )}
                    </Field>
                    <Field name='description'>
                      {({ input, meta }) => (
                        <div
                          className={`input-block ${
                            meta.error && meta.touched ? 'input-error' : ''
                          }`}
                        >
                          <label>Description *</label>
                          <input {...input} type='text' />
                        </div>
                      )}
                    </Field>

                    <button type='submit'>
                      Submit
                    </button>
                  </form>
                )}
              />
            </div>
          </div>
        </section>
      </React.Fragment>
    );
}

export default Upload;
