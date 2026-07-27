import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";

import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { Folder as FolderIcon } from "@phosphor-icons/react/dist/ssr/Folder";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { ArrowUp as ArrowUpIcon } from "@phosphor-icons/react/dist/ssr/ArrowUp";
import { ArrowDown as ArrowDownIcon } from "@phosphor-icons/react/dist/ssr/ArrowDown";
import { Tag as TagIcon } from "@phosphor-icons/react/dist/ssr/Tag";

function SummaryCard({ title, value, icon, color, trend, progress }) {
	const theme = useTheme();
	return (
		<Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
			<CardContent sx={{ flexGrow: 1, p: 3 }}>
				<Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
					<Grid size={{ xs: 8 }}>
						<Typography color="text.secondary" variant="overline" sx={{ fontWeight: 600, letterSpacing: 1, mb: 1, display: 'block' }}>
							{title}
						</Typography>
						<Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
							{value}
						</Typography>
					</Grid>
					<Grid size={{ xs: 4 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
						<Avatar sx={{ backgroundColor: color, height: 56, width: 56 }}>
							{icon}
						</Avatar>
					</Grid>
				</Grid>

				{trend && (
					<Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
						<Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: trend.direction === 'up' ? 'success.main' : 'error.main' }}>
							{trend.direction === 'up' ? <ArrowUpIcon weight="bold" /> : <ArrowDownIcon weight="bold" />}
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								{trend.value}%
							</Typography>
						</Stack>
						<Typography color="text.secondary" variant="body2" sx={{ ml: 1 }}>
							Desde el mes pasado
						</Typography>
					</Box>
				)}

				{progress !== undefined && (
					<Box sx={{ mt: 3 }}>
						<LinearProgress
							value={progress}
							variant="determinate"
							sx={{
								height: 6,
								borderRadius: 3,
								backgroundColor: 'action.hover',
								'& .MuiLinearProgress-bar': { backgroundColor: color, borderRadius: 3 }
							}}
						/>
					</Box>
				)}
			</CardContent>
		</Card>
	);
}

export default function Page() {
	return (
		<Box sx={{ pt: 0, pb: 3, px: 1, maxWidth: 1200, margin: '0 auto' }}>
			<Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
				Panel de Control FAB LAB
			</Typography>
			<Grid container spacing={3}>
				<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
					<SummaryCard
						title="DISEÑOS 3D"
						value="124"
						icon={<CubeIcon size={32} weight="fill" />}
						color="#6366F1"
						trend={{ direction: 'up', value: 12 }}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
					<SummaryCard
						title="VISUALIZACIONES"
						value="4.2k"
						icon={<EyeIcon size={32} weight="fill" />}
						color="#10B981"
						trend={{ direction: 'down', value: 16 }}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
					<SummaryCard
						title="PROY. DIGITALES"
						value="75.5%"
						icon={<FolderIcon size={32} weight="fill" />}
						color="#F79009"
						progress={75.5}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
					<SummaryCard
						title="EDITORES"
						value="15"
						icon={<UsersIcon size={32} weight="fill" />}
						color="#6366F1"
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
					<SummaryCard
						title="CATEGORIAS"
						value="48"
						icon={<TagIcon size={32} weight="fill" />}
						color="#F79009"
					/>
				</Grid>
			</Grid>
		</Box>
	);
}
