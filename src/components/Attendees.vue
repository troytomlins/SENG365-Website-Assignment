<template>
  <!-- Modal -->
  <div class="modal fade" id="attendeesPopup" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="attendeePopupTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">

        <!--title-->
        <div class="modal-header">
          <h2 id="attendeePopupTitle" class="">Current attendees:</h2>
        </div>

        <!--modal body-->
        <div class="modal-body form">
          <div v-if="attendees.length === 0">
            No Attendees Found
          </div>
          <div v-else>
            <div class="row" v-for="attendee in attendees" v-bind:key="attendee.id">
              <div class="col-2">
                {{ attendee.status }}
              </div>
              <div class="col">
                {{ attendee.firstName }} {{ attendee.lastName}}
              </div>
              <div class="col-4" v-if="isOrganizer && attendee.status === 'pending'">
                <button class="btn btn-success py-0 px-1" @click="changeStatus(attendee.attendeeId, 'accepted')">Approve</button>
                <button class="btn btn-danger py-0 px-1" @click="changeStatus(attendee.attendeeId, 'rejected')">Reject</button>
              </div>
            </div>
          </div>
        </div>

        <!--footer-->
        <div class="modal-footer justify-content-between">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {Modal} from "bootstrap";
import Api from "@/Api";
import Cookies from 'js-cookie'
export default {
  name: "Attendees",
  props: {
    attendees: {
      default: []
    },
    isOrganizer: {
      type: Boolean,
      default: false
    },
    eventId: {
      type: String
    }
  },
  data() {
    return {
      modal: null
    }
  },
  methods: {
    changeStatus(id, status) {
      const token = Cookies.get('token')
      Api.changeAttendance(id, this.eventId, status, token).then(() => {
        this.$parent.getAttendees()
      })
    }
  },
  mounted() {
    this.modal = new Modal(document.getElementById("attendeesPopup"));
  }
}
</script>

<style scoped>

</style>