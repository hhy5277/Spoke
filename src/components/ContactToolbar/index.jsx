import PropTypes from "prop-types";
import { StyleSheet, css } from "aphrodite";
import React from "react";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import { getLocalTime, getContactTimezone } from "../../lib/timezones";
import { getProcessEnvDstReferenceTimezone } from "../../lib/tz-helpers";
import ContactInfo from "./ContactInfo";
import Tags from "./Tags";
import theme from "../../styles/theme";

const styles = StyleSheet.create({
  tagButton: {
    marginRight: "10px"
  }
});

const inlineStyles = {
  toolbar: {
    backgroundColor: theme.colors.EWnavy
  },
  cellToolbarTitle: {
    color: theme.colors.white,
    fontSize: 20
  },
  locationToolbarTitle: {
    color: theme.colors.white,
    fontSize: "1em"
  },
  timeToolbarTitle: {
    color: theme.colors.white,
    fontSize: "1em"
  }
};

const ContactToolbar = function ContactToolbar(props) {
  const { campaignContact, rightToolbarIcon } = props;

  const { location } = campaignContact;

  let city = "";
  let state = "";
  let timezone = null;
  let offset = 0;
  let hasDST = false;

  if (location) {
    city = location.city;
    state = location.state;
    timezone = location.timezone;
    if (timezone) {
      offset = timezone.offset || offset;
      hasDST = timezone.hasDST || hasDST;
    }
    const adjustedLocationTZ = getContactTimezone(props.campaign, location);
    if (adjustedLocationTZ && adjustedLocationTZ.timezone) {
      offset = adjustedLocationTZ.timezone.offset;
      hasDST = adjustedLocationTZ.timezone.hasDST;
    }
  }

  let formattedLocation = `${city}`;
  if (city && state) {
    formattedLocation = `${formattedLocation}, `;
  }
  formattedLocation = `${formattedLocation} ${state}`;

  const dstReferenceTimezone = props.campaign.overrideOrganizationTextingHours
    ? props.campaign.timezone
    : getProcessEnvDstReferenceTimezone();

  const formattedLocalTime = getLocalTime(
    offset,
    hasDST,
    dstReferenceTimezone
  ).format("LT"); // format('h:mm a')
  return (
    <div>
      <Toolbar style={inlineStyles.toolbar}>
        <ToolbarGroup style={inlineStyles.group}>
          <ToolbarTitle
            text={campaignContact.firstName}
            style={inlineStyles.cellToolbarTitle}
          />
          //
          <ToolbarTitle style={inlineStyles.cellToolbarTitle} />
          {location ? (
            <ToolbarTitle
              style={inlineStyles.timeToolbarTitle}
              text={formattedLocalTime}
            />
          ) : (
            ""
          )}
          {location ? (
            <ToolbarTitle
              style={inlineStyles.locationToolbarTitle}
              text={formattedLocation}
            />
          ) : (
            ""
          )}
          {rightToolbarIcon}
        </ToolbarGroup>
        <ToolbarGroup>
          <Tags
            className={css(styles.tagButton)}
            campaign={props.campaign}
            campaignContact={props.campaignContact}
            assignment={props.assignment}
          />
          <ContactInfo
            campaign={props.campaign}
            campaignContact={props.campaignContact}
            assignment={props.assignment}
          />
        </ToolbarGroup>
      </Toolbar>
    </div>
  );
};

ContactToolbar.propTypes = {
  campaignContact: PropTypes.object, // contacts for current assignment
  rightToolbarIcon: PropTypes.element,
  campaign: PropTypes.object,
  assignment: PropTypes.object
};

export default ContactToolbar;
