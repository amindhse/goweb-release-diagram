import { ref, toRaw, watchEffect } from "vue";
import type { NodeArray, Node } from "@markwhen/parser/lib/Node";
import type { Timeline } from "@markwhen/parser/lib/Types";
import { useAppStore } from "@/App/appStore";
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { usePageStore } from "@/Markwhen/pageStore";
import { useTransformStore } from "@/Markwhen/transformStore";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";

export type EventPaths = { [pathType in EventPath["type"]]?: EventPath };

export interface EventPath {
  type: "whole" | "page" | "pageFiltered";
  path: number[];
}

export interface AppState {
  isDark?: boolean;
  hoveringPath?: EventPaths;
  detailPath?: EventPath;
}
export interface MarkwhenState {
  rawText?: string;
  parsed?: Timeline[];
  page?: PageState;
}
export interface PageState {
  index?: number;
  parsed?: Timeline;
  transformed?: Node<NodeArray>;
}
export interface State {
  app?: AppState;
  markwhen?: MarkwhenState;
}

export const useStateSerializer = () => {
  const state = ref<State>();

  const appStore = useAppStore();
  const markwhenStore = useMarkwhenStore();
  const pageStore = usePageStore();
  const transformStore = useTransformStore();
  const editorOrchestrator = useEditorOrchestratorStore();
  const eventDetailStore = useEventDetailStore();

  watchEffect(() => {
    state.value = {
      app: {
        isDark: appStore.inferredDarkMode,
        hoveringPath: toRaw(editorOrchestrator.hoveringEventPaths) || undefined,
        detailPath: toRaw(eventDetailStore.detailEventPath),
      },
      markwhen: {
        rawText: markwhenStore.rawTimelineString,
        parsed: markwhenStore.timelines,
        page: {
          index: pageStore.pageIndex,
          parsed: pageStore.pageTimeline,
          transformed: transformStore.transformedEvents,
        },
      },
    };
  });

  return state;
};
