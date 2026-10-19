import type { SlideDef } from "../deck/steps";
import { agendaSlide, introSlides } from "./intro";
import { s1Slides } from "./s1-history";
import { s2Slides } from "./s2-prolog";
import { s3Slides, summarySlide } from "./s3-types";
import { outroSlide } from "./outro";

export const SLIDES: SlideDef[] = [
  ...introSlides,
  ...s1Slides,
  agendaSlide(1),
  ...s2Slides,
  agendaSlide(2),
  ...s3Slides,
  summarySlide,
  outroSlide,
];
