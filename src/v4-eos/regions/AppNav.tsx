import { V2_APP_NAV, type AuthoringContext, type NavDestination } from "../data";
import { Icon, type IconName } from "../ui-lib/Icon";
import { IcebergLogo } from "../ui-lib/IcebergLogo";
import { routes, navigate } from "../browse";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

// Distinct icon per nav destination, keyed by the V2 nav label. Any unmapped
// item falls back to its initial letter (see lookup in the render).
const NAV_ICONS: Record<string, IconName> = {
  Pages: "file",
  Widgets: "blocks",
  "Content Pages": "doc-text",
  "Event Pages": "calendar",
  "Central Mgmt": "cube",
  "QA Queue": "clipboard-check",
  Experiments: "flask",
  "Scheduled Pages": "calendar-clock",
  Redirects: "redirect",
  "Services CMS": "server",
  Help: "help",
};

interface AppNavProps {
  // The active authoring context; the bound nav item is shown as current. "home"
  // marks the dashboard landing, where no product-nav item is current.
  context: AuthoringContext | "home" | "contentPage";
  // Invoked when an actionable (context-bound) nav item is clicked. The shell
  // decides what this means: in the editor it swaps the in-editor dataset; in
  // the browse levels it navigates to that context's list via a hash route.
  onSelectContext: (context: NavDestination) => void;
}

// Narrow left rail: icon-only tiles. Names appear in an instant tooltip on
// hover/focus (DESIGN.md Navigation). Pages / Widgets / Content Pages are
// actionable; the rest stay inert and keep the same appearance.
export function AppNav({ context, onSelectContext }: AppNavProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <nav className="ui-ws__region ui-ws-nav" aria-label="Primary">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="ui-ws-nav__brand ui-ws-nav__brand--link"
              aria-label="Iceberg home"
              onClick={() => navigate(routes.home())}
            >
              <IcebergLogo height={26} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} className="ui-ws-nav__tip">
            Home
          </TooltipContent>
        </Tooltip>
        <div className="ui-ws-nav__list">
          {V2_APP_NAV.map((item) => {
            const actionable = item.context !== undefined;
            const active = actionable && item.context === context;
            const icon = NAV_ICONS[item.label];
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={`ui-ws-nav__item${active ? " ui-ws-nav__item--active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    aria-label={item.label}
                    onClick={
                      actionable ? () => onSelectContext(item.context!) : undefined
                    }
                  >
                    <span className="ui-ws-nav__icon" aria-hidden="true">
                      {icon ? (
                        <Icon name={icon} size={22} />
                      ) : (
                        <span className="ui-ws-nav__initial">
                          {item.label.charAt(0)}
                        </span>
                      )}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} className="ui-ws-nav__tip">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </nav>
    </TooltipProvider>
  );
}
