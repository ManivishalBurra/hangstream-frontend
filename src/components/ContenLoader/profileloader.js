import React from "react";
import ContentLoader from "react-content-loader";

const ProfileShow = (props) => (
  <ContentLoader
    speed={3}
    width={1200}
    height={500}
    viewBox="0 0 900 480"
    backgroundColor="rgb(211, 211, 211)"
    foregroundColor="#F9F6F7"
    {...props}
  >
    <rect x="70" y="10" rx="35" ry="35" width="300" height="220" />
    <rect x="70" y="250" rx="35" ry="35" width="300" height="220" />
    <rect x="450" y="10" rx="35" ry="35" width="300" height="460" />
  </ContentLoader>
);

export default ProfileShow;
