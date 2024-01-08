import * as React from 'react';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import styles from './Container.module.scss';
import * as strings from 'PageHierarchyWebPartStrings';
import { BreadcrumbLayout, ListLayout } from '../Layouts';
import { IContainerProps } from './IContainerProps';
import { PagesToDisplay } from '@src/utilities';
import { usePageApi } from '@src/apiHooks/usePageApi';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { TreeLayout } from '../Layouts/TreeLayout';

export const Container: React.FunctionComponent<IContainerProps> = props => {
  // Use props.treeFrom / treeExpandTo value from settings only in display mode "tree"
  const treeFrom = (props.pagesToDisplay === PagesToDisplay.Tree) ? props.treeFrom : undefined;
  const treeExpandTo = (props.pagesToDisplay === PagesToDisplay.Tree) ? props.treeExpandTo : undefined;
  const pagesApi = usePageApi(props.currentPageId, props.pageEditFinished, props.context, treeFrom, treeExpandTo);
  let controlToRender = undefined;
  switch (props.pagesToDisplay) {
    case PagesToDisplay.Ancestors:
      controlToRender = <BreadcrumbLayout domElement={props.domElement} pages={pagesApi.state.ancestorPages} themeVariant={props.themeVariant} />;
      break;
    case PagesToDisplay.Children:
      controlToRender = <ListLayout domElement={props.domElement} pages={pagesApi.state.childrenPages} themeVariant={props.themeVariant} />;
      break;
    case PagesToDisplay.Tree:
      controlToRender = <TreeLayout domElement={props.domElement} pages={pagesApi.state.childrenPages} themeVariant={props.themeVariant} nav={pagesApi.state.tree} pageId={props.currentPageId} />
      break;
    default:
      controlToRender = <div>
        <Placeholder
          iconName='Edit'
          iconText={strings.Configuration_Placeholder_IconText}
          description={strings.Configuration_Placeholder_Description}
          buttonLabel={strings.Configuration_Placeholder_ButtonLabel}
          onConfigure={props.onConfigure} />
      </div>;
      break;
  }

  // if the parent page column was never created or it was deleted force them to recreate it
  if (!pagesApi.state.parentPageColumnExists) {
    controlToRender =
      <div>
        <Placeholder
          iconName='FieldRequired'
          hideButton={!pagesApi.state.userCanManagePages}
          iconText={strings.ParentPageMissing_Placeholder_IconText}
          description={!pagesApi.state.userCanManagePages ? strings.ParentPageMissing_Placeholder_Description_NoPermissions : strings.ParentPageMissing_Placeholder_Description}
          buttonLabel={strings.ParentPageMissing_Placeholder_ButtonLabel}
          onConfigure={pagesApi.addParentPageField} />
      </div>;
  }

  return (
    <div className={styles.defaultContainer}>
      <div className={styles.container}>
        {props.showTitle && <WebPartTitle themeVariant={props.themeVariant} title={props.title} displayMode={props.displayMode} updateProperty={props.updateTitle} />}
        {controlToRender}
      </div>
    </div>
  );

};
