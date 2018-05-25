import React, { Fragment } from "react";
import SearchResult from "../searchResult";
import { connectHits } from "react-instantsearch/connectors";
import Grid from "@material-ui/core/Grid";
import Display from "../../utils/display";
import Link from "next/link";
import Typography from "@material-ui/core/Typography";
import aphrodite from "../../utils/aphrodite";
import object from "../../utils/object";
import { css } from "aphrodite";
import dynamic from "next/dynamic";

const StaticMap = dynamic(import("../staticMap"), {
  loading: () => (
    <div
      style={{
        width: "455px",
        height: "400px",
        backgroundColor: "white"
      }}
    />
  ),
  ssr: false
});

export default connectHits(({ hits }) => {
  const mobile = hits => {
    return (
      <div
        className={"search_results"}
        style={{ backgroundColor: "#f1f1f1", height: "110%" }}
      >
        {hits.map((hit, idx) => (
          <SearchResult key={idx} order={idx} hit={hit} />
        ))}
      </div>
    );
  };

  const desktop = hits => {
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
          {hits.map((hit, idx) => <SearchResult key={idx} hit={hit} />)}
        </Grid>
        {Object.keys(hits).length ? (
          <Grid item style={{ marginLeft: `12px` }}>
            <Grid
              container
              direction="column"
              spacing={0}
              style={{ width: `439px` }}
            >
              <Grid item>{/*<StaticMap />*/}</Grid>
              {/*<Grid item style={{ marginTop: "8px", marginBottom: "8px" }}>*/}
              {/*<Divider />*/}
              {/*</Grid>*/}

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
                                {`${imagesObj[image].name.substring(0, 10)}..`}
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

  return (
    <Fragment>
      <Display format="tablet-desktop">{desktop(hits)}</Display>
      <Display format="mobile">{mobile(hits)}</Display>
    </Fragment>
  );
});
