import React, { Component } from "react";
import Text from "../../components/Text";
import { Target } from "../../models/target";
import Tile from "../../components/Tile";
import Table from "../../components/Table";
import IconButton from "../../components/IconButton";

export interface LocationViewProps {
  target: Target;
}

class LocationView extends Component<LocationViewProps> {
  openMap = () => {
    const {latitude, longitude} = this.props.target.location!;
    window.open(`http://maps.google.com/maps?daddr=${latitude},${longitude}&amp;ll=`, "blank");
  }
  render() {
    const { target } = this.props;

    return (
      <Tile title="LOCATION" actions={
        <div>
          <IconButton onClick={this.openMap}>
            <i className="material-icons">map</i>
          </IconButton>
        </div>
      }>
        <Table
          data={{
            COUNTRY: target.location!.country,
            CITY: target.location!.city,
            LATITUDE: target.location!.latitude,
            LONGITUDE: target.location!.longitude,
            ACCURACY: target.location!.accuracy
          }}
        />
      </Tile>
    );
  }
}

export default LocationView;
