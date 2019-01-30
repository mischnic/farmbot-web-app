import { detectLanguage } from "../i18n";
import * as i18next from "i18next";
import { attachFrontPage } from "./front_page";


detectLanguage().then((config) => i18next.init(config, attachFrontPage));
