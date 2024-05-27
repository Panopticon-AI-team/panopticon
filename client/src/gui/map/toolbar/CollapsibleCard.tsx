import { useState } from "react"; 
import Card from "@mui/material/Card"; 
import Collapse from "@mui/material/Collapse"; 
import CardHeader from "@mui/material/CardHeader"; 
import Container from "@mui/material/Container"; 
import CardContent from "@mui/material/CardContent"; 
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; 
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"; 
import IconButton from "@mui/material/IconButton"; 

interface CollapsibleCardProps {
    title: string;
    content: JSX.Element;
    width: number;
}

export default function CollapsibleCard(props: Readonly<CollapsibleCardProps>) { 
    const [open, setOpen] = useState(false); 
    return ( 
        <> 
            <Card sx={{ 
                minWidth: props.width, 
                // border: "1px solid rgba(211,211,211,0.6)"
            }}> 
                <CardHeader 
                    title={props.title}
                    action={ 
                        <IconButton 
                            onClick={() => setOpen(!open)} 
                            aria-label="expand"
                            size="small"
                        > 
                            {open ? <KeyboardArrowUpIcon /> 
                                : <KeyboardArrowDownIcon />} 
                        </IconButton> 
                    }
                    style={{ textAlign: 'left' }}
                ></CardHeader>
                <div style={{ 
                    backgroundColor: "#282c34"
                }}> 
                    <Collapse in={open} timeout="auto"
                        unmountOnExit> 
                        <CardContent> 
                            <Container sx={{ 
                                height: 300, 
                                lineHeight: 2 
                            }}> 
                                {props.content}
                            </Container> 
                        </CardContent> 
                    </Collapse> 
                </div> 
            </Card> 
        </> 
    ); 
} 
