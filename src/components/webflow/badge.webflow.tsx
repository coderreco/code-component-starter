import { declareComponent } from "@webflow/react";
import { Badge, variants } from "../ui/badge";
import { props } from "@webflow/data-types";

export default declareComponent(Badge, {
  name: "Badge",
  description: "A badge component to display status or counts.",
  group: "UI Components",
  props: {
    children: props.Text({
      tooltip: "The content of the badge.",
      defaultValue: "Badge",
      name: "Text",
    }),
    variant: props.Variant({
      name: "Variant",
      tooltip: "The visual style of the badge.",
      defaultValue: "default",
      options: Object.keys(variants).map((key) => key as string),
    }),
  },
});
