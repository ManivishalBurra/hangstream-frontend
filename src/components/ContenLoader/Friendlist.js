import React from "react";
import ContentLoader from "react-content-loader";

const FriendsShow = (props) => (
  <ContentLoader
    speed={2}
    width={400}
    height={160}
    viewBox="0 0 400 160"
    backgroundColor="#d9d9d9"
    foregroundColor="#ededed"
    {...props}
  >
    <rect x="50" y="14" rx="10" ry="10" width="343" height="18" />
    <rect x="8" y="6" rx="25" ry="25" width="35" height="35" />
    <rect x="50" y="63" rx="10" ry="10" width="343" height="18" />
    <rect x="8" y="55" rx="25" ry="25" width="35" height="35" />
    <rect x="50" y="112" rx="10" ry="10" width="343" height="18" />
    <rect x="8" y="104" rx="25" ry="25" width="35" height="35" />
  </ContentLoader>
);

export default FriendsShow;
