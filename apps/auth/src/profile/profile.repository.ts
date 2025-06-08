import {Injectable, Logger} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {UserDocument} from "@app/common/models/user.schema";
import {AbstractRepository} from "@app/common";
import {Model} from "mongoose";

@Injectable()
export class ProfileRepository extends AbstractRepository<UserDocument> {
    protected readonly logger = new Logger(ProfileRepository.name);

    constructor(@InjectModel(UserDocument.name) userModel: Model<UserDocument>) {
        super(userModel);
    }
}