import React from "react";
import ManualAction from "./ManualAction";
import FeatureList from "./FeatureList";
import TargetDetailsView from "./TargetDetailsView";
import Divider from "components/Divider";

export default function LeftLayout() {
  return (
    <div>
      <Divider />
      <TargetDetailsView />
      <Divider />
      <FeatureList />
      <Divider />
      <ManualAction />
    </div>
  );
}
