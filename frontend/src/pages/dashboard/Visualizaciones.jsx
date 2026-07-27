import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function Page() {
    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Visualizaciones
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Esta es una página en blanco para las Visualizaciones de las personas en cada proyecto en el que interactuen.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
