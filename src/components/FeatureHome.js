import React, { Component } from 'react'

const FeatureHome = ({ image, title, description, link }) => (
    <div
      class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12"
      style={{ marginBottom: 15 }}
    >
      <div class="card2">
        <img class="material-icons" alt={title} src={image} />
        <div class="card-body">
          <h5 class="card-title">
            {link ? (
              <a href={link} alt="View on Wiki">
                {title}
              </a>
            ) : (
              title
            )}
          </h5>
          <p class="card-text">{description}</p>
        </div>
      </div>
    </div>
  )
  
  export default FeatureHome