import React, { useContext } from 'react';
import { Dimmer } from 'semantic-ui-react';
import ApiContext from '../default/ApiContext';

/**
 * 無資料遮罩
 *
 * @param {object} props props
 * @param {boolean} props.active 啟停用條件
 * @param {boolean} props.content 文字
 * @param {Element} props.children 被屏蔽內容
 * @returns {React.ReactElement} NoDataDimmer
 */
const NoDataDimmer = (props) => {
  const { tr } = useContext(ApiContext);
  const { active, content, children } = props;
  const outerProps = { ...props };

  delete outerProps.active;
  delete outerProps.content;
  delete outerProps.children;

  return (
    <Dimmer.Dimmable {...outerProps}>
      <Dimmer active={active}>
        {content !== undefined ? content : tr('COMMON_TEXT_NO_DATA')}
      </Dimmer>
      {children}
    </Dimmer.Dimmable>
  );
};

export default NoDataDimmer;
