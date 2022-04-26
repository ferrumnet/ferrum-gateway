import React from "react";
import { FSider, FSiderItem } from "ferrum-design-system";
import { MdGroup } from "react-icons/md";
import { RiSwapLine } from "react-icons/ri";
import {FaHandshake,FaFileContract} from "react-icons/fa";

export const AsideMenu = (props: { groupId:string }) => {
  const {groupId} = props;
  return (
    <FSider>
      <FSiderItem
        to={`/`}
        title="Contracts"
        prefix={<FaFileContract />}
      />
      <FSiderItem
        to={`/quorums`}
        title="Quorums"
        prefix={<FaHandshake />}
      />
      <FSiderItem
        to={`/groups`}
        title="Groups"
        prefix={<MdGroup />}
      />
    </FSider>
  );
};
