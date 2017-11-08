import * as React from "react";
import * as moment from "moment";
import { connect } from "react-redux";
import { Col, Row, Page, ToolTip } from "../ui";
import { mapStateToProps } from "./state_to_props";
import { Log } from "../interfaces";
import { t } from "i18next";
import { Popover, Position } from "@blueprintjs/core";
import * as _ from "lodash";
import { LogsTableProps, LogsState, LogsFilterMenuProps, LogsProps } from "./interfaces";

export const formatLogTime = (created_at: number) =>
  moment.unix(created_at).local().format("MMM D, h:mma");

const LogsTable = (props: LogsTableProps) => {
  return <table className="pt-table pt-striped logs-table">
    <thead>
      <tr>
        <th><label>{t("Type")}</label></th>
        <th><label>{t("Message")}</label></th>
        {/* <th><label>{t("Position (x, y, z)")}</label></th> */}
        <th><label>{t("Time")}</label></th>
      </tr>
    </thead>
    <tbody>
      {props.logs.map((log: Log) => {
        const isFiltered = log.message.toLowerCase().includes("filtered");
        if (!isFiltered) { return LogsRow(log, props.state); }
      })}
    </tbody>
  </table>;
};

const LogsRow = (log: Log, state: LogsState) => {
  const time = formatLogTime(log.created_at);
  const type = (log.meta || {}).type;
  const filtered = state[type as keyof LogsState];
  const displayLog = _.isUndefined(filtered) || filtered;
  return displayLog ?
    <tr key={log.id}>
      <td>
        <div className={`saucer ${type}`} />
        {_.startCase(type)}
      </td>
      <td>
        {log.message || "Loading"}
      </td>
      {/* <td>0, 0, 0</td> // TODO: display log position data*/}
      <td>
        {time}
      </td>
    </tr> : undefined;
};

export const LogsFilterMenu = (props: LogsFilterMenuProps) => {
  const btnColor = (x: keyof LogsState) => props.state[x] ? "green" : "red";
  return <div>
    {Object.keys(props.state)
      .filter(x => { if (!(x == "autoscroll")) { return x; } })
      .map((logType: keyof LogsState) => {
        return <fieldset key={logType}>
          <label style={{ marginTop: "7px" }}>
            <div className={`saucer ${logType}`}
              style={{ float: "left", marginRight: "10px" }} />
            {_.startCase(logType)}
          </label>
          <button
            className={"fb-button fb-toggle-button " + btnColor(logType)}
            onClick={props.toggle(logType)} />
        </fieldset>;
      })}
  </div>;
};

@connect(mapStateToProps)
export class Logs extends React.Component<LogsProps, Partial<LogsState>> {

  state: LogsState = {
    autoscroll: false,
    success: true,
    busy: true,
    warn: true,
    error: true,
    info: true,
    fun: true,
    debug: true,
  };

  toggle = (name: keyof LogsState) =>
    () => this.setState({ [name]: !this.state[name] });

  render() {
    return <Page className="logs">
      <Row>
        <Col xs={10}>
          <h3>
            <i>{t("Logs")}</i>
          </h3>
          <ToolTip helpText={"View and filter log messages."} />
        </Col>
        <Col xs={2}>
          <Popover position={Position.BOTTOM_RIGHT}>
            <i className="fa fa-gear" style={{ float: "right" }} />
            <LogsFilterMenu toggle={this.toggle} state={this.state} />
          </Popover>
        </Col>
      </Row>
      <Row>
        <LogsTable logs={this.props.logs} state={this.state} />
      </Row>
    </Page>;
  }
}