"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath  } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateBoard } from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";


const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if(!userId || !orgId){
        return{
            errors: "Unauthorized",
        };
    }

    const { title, id } = data;

    // const [
    //    imageId,
    //    imageThumbUrl,
    //    imageFullUrl,
    //    imageLinkHTML,
    //    imageUserName,
    // ] = image.split("|");

    // if(!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML) {
    //     return {
    //         errors: "Missing fields. Failed to create board."
    //     };
    // }

    let board;

    try{
        board = await db.board.update({
            where: {
                id,
                orgId,
            },
            data: {
                title,
            }
        });

        await createAuditLog({
            entityTitle: board.title,
            entityId: board.id,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.UPDATE,
        })
    } catch (error){
        return {
            errors: "Failed to create."
        }
    }

    revalidatePath(`/board/${id}`);
    return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard,handler);