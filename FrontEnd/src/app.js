import React from 'react'
import {Cloudinary} from "@cloudinary/url-gen";

const App = () => {

  // Create a Cloudinary instance and set your cloud name.
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'demo'
    }
  });
};