
import { memo } from "react";
import { createUseClassNames } from "app/theme";
import { cx } from "tss-react";
import { ReactComponent as AgentConnectLightSvg } from "app/assets/svg/agentConnectLight.svg";
import { ReactComponent as AgentConnectDarkSvg } from "app/assets/svg/agentConnectDark.svg";
import { useIsDarkModeEnabled¬†}¬†from "onyxia-ui";

export type Props = {
	className?: string;
	url: string;
};

const { useClassNames } = createUseClassNames()(
	theme => ({
		"root": {
			"padding": theme.spacing(1, 0),
			"display": "flex",
			"justifyContent": "center",
			"borderRadius": 8,
			"borderWidth": 2,
			"borderStyle": "solid",
			"borderColor": "transparent",
			"backgroundColor":
				theme.isDarkModeEnabled ?
					theme.colors.useCases.typography.textPrimary :
					theme.colors.palette.agentConnectBlue.main,
			"boxSizing": "border-box",
			"&:hover": {
				"backgroundColor":
					theme.isDarkModeEnabled ?
						theme.colors.palette.agentConnectBlue.lighter :
						theme.colors.palette.agentConnectBlue.light,
				"borderColor": theme.isDarkModeEnabled ?
					theme.colors.palette.agentConnectBlue.light :
					undefined,
			}
		},
		"svg": {
			"height": 48
		}
	})
);

export const AgentConnectButton = memo(
	(props: Props) => {

		const { className, url } = props;

		const { classNames } = useClassNames({});

		const { isDarkModeEnabled }¬†= useIsDarkModeEnabled();

		const AgentConnectSvg = isDarkModeEnabled ? AgentConnectDarkSvg : AgentConnectLightSvg;

		return (
			<a className={cx(classNames.root, className)} href={url}>
				<AgentConnectSvg className={classNames.svg}/>
			</a>
		);

	}
);
