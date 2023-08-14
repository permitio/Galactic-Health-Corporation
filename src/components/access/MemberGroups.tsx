import { MemberGroup } from "@/models/models";
import { Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Skeleton, Table, TextField, Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import GroupIcon from '@mui/icons-material/Group';

const MemberGroups = () => {
    const [open, setOpen] = useState<string[]>([]);
    const [memberGroups, setMemberGroups] = useState<MemberGroup[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [addGroupDialog, setAddGroupDialog] = useState<boolean>(false);
    const [addingGroup, setAddingGroup] = useState<boolean>(false);
    const [groupName, setGroupName] = useState<string>('');
    const [addGroupError, setAddGroupError] = useState<string>('');
    const [addMemberDialog, setAddMemberDialog] = useState<string>('');
    const [addingMember, setAddingMember] = useState<boolean>(false);
    const [memberEmail, setMemberEmail] = useState<string>('');
    const [addMemberError, setAddMemberError] = useState<string>('');


    const handleAddGroup = async () => {
        setAddingGroup(true);
        const res = await fetch('/api/account/member-groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: groupName })
        });
        const status = await res.status;
        if (status !== 200) {
            const data = await res.json();
            setAddGroupError(data.message);
            setAddingGroup(false);
            return;
        }
        setAddingGroup(false);
        setAddGroupDialog(false);
        setGroupName('');
        setLoading(true);
        await fetchMemberGroups();
        setLoading(false);
    }

    const handleDeleteGroup = async (key: string) => {
        setLoading(true);
        await fetch(`/api/account/member-groups`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key })
        });
        await fetchMemberGroups();
        setLoading(false);
    }

    const handleAssignMember = async () => {
        setAddingMember(true);
        const res = await fetch(`/api/account/member-groups/assign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: memberEmail, group: addMemberDialog })
        });
        const status = await res.status;
        if (status !== 200) {
            const data = await res.json();
            setAddMemberError(data.message);
            setAddingMember(false);
            return;
        }
        setAddingMember(false);
        setAddMemberDialog('');
        setMemberEmail('');
        setLoading(true);
        await fetchMemberGroups();
        setLoading(false);
    }

    const handleUnassignMember = async (email: string, group: string) => {
        setLoading(true);
        await fetch(`/api/account/member-groups/unassign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, group })
        });
        await fetchMemberGroups();
        setLoading(false);
    }

    const fetchMemberGroups = async () => {
        const response = await fetch('/api/account/member-groups');
        const data = await response.json();
        setMemberGroups(data);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            await fetchMemberGroups();
            setLoading(false);
        })();
    }, []);

    const handleCollapseList = (key: string) => {
        if (open.includes(key)) {
            setOpen(open.filter((item) => item !== key));
        } else {
            setOpen([...open, key]);
        }
    }

    return (
        <div>
            <h2 className="my-2 font-semibold  text-sky-600 mb-2">Member Groups</h2>
            <Paper className="mb-2">
                {loading && <Skeleton height={80} className="mx-7" />}
                {!loading && (
                    <List>
                        {memberGroups.map(({ key, name, members }) => (
                            <Fragment key={key}>
                                <ListItem
                                    disablePadding
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => (handleDeleteGroup(key))}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemButton
                                        onClick={() => (handleCollapseList(key))}
                                    >
                                        <ListItemIcon sx={{minWidth: '36px'}}>
                                            {open.includes(key) ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                                        </ListItemIcon>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <GroupIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={name} />
                                    </ListItemButton>
                                </ListItem>
                                <Collapse in={open.includes(key)} timeout="auto" unmountOnExit className="bg-slate-50">
                                    <List component="div" disablePadding className="pl-4 ml-4">
                                        {members.map(({ email, first_name, last_name }) => (
                                            <ListItem
                                                key={email}
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" onClick={() => (handleUnassignMember(email || '', key))}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        {first_name?.[0]}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={`${first_name} ${last_name}`} secondary={email} />
                                            </ListItem>
                                        ))}
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <AddCircleOutlineIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Add Member" onClick={() => setAddMemberDialog(key)} />
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            </Fragment>
                        ))}
                        <ListItemButton>
                            <ListItemIcon sx={{minWidth: '36px'}}>
                                <AddCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Add Member Group" onClick={() => setAddGroupDialog(true)} />
                        </ListItemButton>
                    </List>
                )}
            </Paper>
            <Dialog
                open={addGroupDialog}
                fullWidth
                disableEscapeKeyDown={addingGroup}
                maxWidth="sm"
            >
                <DialogTitle>Add Member Group</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {addGroupError && <Typography color="error">{addGroupError}</Typography>}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="groupName"
                        label="Group Name"
                        fullWidth
                        variant="standard"
                        value={groupName}
                        onChange={(e) => (setGroupName(e.target.value))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button disabled={addingGroup} onClick={() => (setAddGroupDialog(false))}>Cancel</Button>
                    <Button onClick={handleAddGroup} disabled={addingGroup || !groupName}>Add</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={addMemberDialog !== ''}
                disableEscapeKeyDown
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add Member</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {addMemberError && <Typography color="error">{addMemberError}</Typography>}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="memberEmail"
                        label="Member Email"
                        fullWidth
                        variant="standard"
                        value={memberEmail}
                        onChange={(e) => (setMemberEmail(e.target.value))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button disabled={addingMember} onClick={() => (setAddMemberDialog(''))}>Cancel</Button>
                    <Button onClick={handleAssignMember} disabled={addingMember || !memberEmail}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default MemberGroups;
