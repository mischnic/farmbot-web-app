import * as React from "react";
import { detectLanguage } from "../i18n";
import * as i18next from "i18next";

const FrontPage =  () => <div className="static-page"></div>;

detectLanguage().then((config) => i18next.init(config, FrontPage));
