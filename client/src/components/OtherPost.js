/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Button, Container, Toolbar, Typography, Stack, Box, Avatar, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PostDetail from './PostDetail';
import {
  changeChatroom, createNewChatroom, getChatroomById, getAllChatrooms, getChatroomByName,
} from '../api/chat';
import { getGroupById } from '../api/groups';
import { getUserById } from '../api/users';

export default function OtherPost({
  ownerId, location, departDate, modeTransport,
  departPlace, maxCapacity, currCapacity, currMemberIds,
  groupId, userId, group, handleLeaveGroup, handleJoinGroup,
  handleGoToChatroom,
}) {
  const navigate = useNavigate();
  const handleChatroom = async (e) => {
    // const newTextData = [];
    const r1 = await getGroupById(groupId);
    const memberIds = r1.currMemberIds;
    // add a separate field in the chatroom that adds a groupId
    console.log('this is group id', groupId);
    const r2 = await getUserById(r1.ownerId);
    const postOwner = r2.name;
    const postLoc = r1.location;
    const chatName = postOwner.concat(' Group to ', postLoc);
    console.log('chat name is ', chatName);
    const allChats = await getAllChatrooms();
    // console.log('check response', allChats.response);
    console.log('all chats most', allChats);
    const exist = Object.values(allChats).filter(
      (chat) => (chat.chatName === chatName),
    );
    console.log('does it exist', exist);
    // const existChat = await getChatroomByName(chatName);
    if (exist.length === 0) {
      console.log('no chat exist');
      const response = await createNewChatroom(groupId, memberIds, chatName);
    // }
    } else {
      const r3 = await getChatroomByName(chatName);
      const id = r3._id;
      Object.values(allChats).forEach((c) => {
        if (c.chatName === chatName) {
          const t = c.texts;
          const membersId = c.currentMembersIds;
          membersId.push(userId);
          changeChatroom(id, chatName, t, membersId);
        }
      });
    }
    navigate('/chatroom');
  };
  function handleClickBack() {
    navigate('/activityfeed');
  }
  return (
    <div>
      <AppBar
        className="postbar"
        position="static"
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 0,
          borderRadius: 2,
          p: 2,
          minWidth: 300,
        }}
      >
        <Toolbar>
          <ArrowBackIcon color="secondary" />
          <Box sx={{ flexGrow: 1 }}>
            <Button variant="text" color="secondary" sx={{ flex: 1 }} onClick={handleClickBack}>Back to Activity Feed</Button>
          </Box>
          <Stack direction="row" spacing={3}>
            {
              (currMemberIds.includes(userId)) ? (
                <Stack direction="row" spacing={3}>
                  <Button variant="contained" color="warning" onClick={handleLeaveGroup}>Leave Group</Button>
                  <Button variant="contained" color="secondary" onClick={handleGoToChatroom}>Go to Chatroom</Button>
                </Stack>
              )
                : ((currCapacity < maxCapacity) && <Button variant="contained" color="secondary" onClick={handleJoinGroup}>Join Group</Button>)
            }
          </Stack>
        </Toolbar>
      </AppBar>
      <PostDetail
        ownerId={ownerId}
        location={location}
        departDate={departDate}
        modeTransport={modeTransport}
        departPlace={departPlace}
        maxCapacity={maxCapacity}
        currCapacity={currCapacity}
        currMemberIds={currMemberIds}
      />

    </div>

  );
}
