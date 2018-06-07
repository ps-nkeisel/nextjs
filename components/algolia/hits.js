import React, { Fragment } from "react";
import SearchResult from "../searchResult";
import { connectHits } from "react-instantsearch/connectors";
import Grid from "@material-ui/core/Grid";
import Link from "next/link";
import Typography from "@material-ui/core/Typography";
import aphrodite from "../../utils/aphrodite";
import object from "../../utils/object";
import { css } from "aphrodite";

class Hits extends React.Component {
  componentDidUpdate() {
    // console.log('new hits')
  }

  render() {
    const { hits, tablet_desktop, mobile } = this.props;

    const render_mobile = hits => {
      return (
        <div
          className={"search_results"}
          style={{ backgroundColor: "#f1f1f1", height: "110%" }}
        >
          {hits.map(hit => <SearchResult mobile key={hit.id.url} hit={hit} />)}
        </div>
      );
    };
    const render_tablet_desktop = hits => {
      let imagesObj = {};
      let images = [];
      hits.map(hit => {
        if (hit.images) {
          const hitImages = object.values(hit.images);
          hitImages.map(
            hitImage =>
              (imagesObj[hitImage] = {
                name: hit.name,
                objectID: hit.objectID,
                images: hitImages
              })
          );
          images = images.concat(hitImages);
        }
      });

      return (
        <Grid
          container
          direction="row"
          spacing={0}
          className={"search_results"}
          style={{ flexWrap: "nowrap" }}
        >
          <Grid
            item
            className={css(
              aphrodite.searchResultsPaddingLeft,
              aphrodite.searchResultsPaddingRight,
              aphrodite.rightBorder
            )}
          >
            {hits.map((hit, idx) => (
              <SearchResult tablet_desktop key={hit.id.url} hit={hit} />
            ))}
          </Grid>
          {Object.keys(hits).length ? (
            <Grid item style={{ marginLeft: `12px` }}>
              <Grid
                container
                direction="column"
                spacing={0}
                style={{ width: `439px` }}
              >
                <Grid item>
                  <Grid container direction="row" spacing={0}>
                    {images.map((image, idx) => {
                      const uri = `https://res.cloudinary.com/clactacom/image/upload/f_auto,q_auto,g_auto,c_fill,w_75,h_75/${image}`;
                      const cpt = idx + 1;
                      return (
                        <Grid
                          item
                          style={{
                            width: "75px",
                            height: "75px",
                            marginBottom: "32px",
                            marginRight: cpt % 5 ? "16px" : null
                          }}
                          key={idx}
                        >
                          <Link
                            href={{
                              pathname: `/${imagesObj[image].objectID}`
                            }}
                          >
                            <a rel="nofollow">
                              <Fragment>
                                <img src={uri} height={75} width={75} />
                                <Typography variant="caption" color="secondary">
                                  {`${imagesObj[image].name.substring(
                                    0,
                                    10
                                  )}..`}
                                </Typography>
                              </Fragment>
                            </a>
                          </Link>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      );
    };
    return <Fragment>{render_tablet_desktop ? render_tablet_desktop(hits) : render_mobile(hits)}</Fragment>;
  }
}

export default connectHits(Hits);
